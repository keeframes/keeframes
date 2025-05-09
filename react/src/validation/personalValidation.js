import { z } from "zod";

const personalSchema = z.object({
  fullname: z
    .string()
    .min(3, "The name needs to be at least 3 characters")
    .max(25, "The name needs to be less than 25 characters"),

  gender: z.enum(["male", "female", "prefer not to say", "other"]),

  age: z
    .number()
    .min(13, "Age can't be under 13")
    .max(120, "Age can't be over 120"),

  // Pronouns validation with custom handling
  pronouns: z
    .enum(["male", "female", "prefer not to say", "other", "custom"]) // Adding the custom option
    .refine((value) => value !== "custom" || value === "custom", {
      message: "Pronouns are required", // Custom logic for pronouns
    }),

  // Custom pronouns validation
  customPronouns: z
    .string()
    .optional() // Custom pronouns are optional initially
    .transform((val) => val.trim().toLowerCase()) // Convert to lowercase
    .refine((val) => val === "" || val.includes("/"), {
      message: "Custom pronouns must include a slash (e.g. they/them)",
    })
    .refine((val) => val === "" || val.length <= 20, {
      message: "Custom pronouns should be less than or equal to 20 characters",
    }),
})
  .refine((data) => {
    // Ensure custom pronouns are entered when 'custom' is selected
    if (data.pronouns === "custom") {
      return data.customPronouns && data.customPronouns.trim().length > 0;
    }
    return true; // No validation needed if 'custom' isn't selected
  }, {
    message: "Please enter your custom pronouns",
    path: ["customPronouns"], // Tied to the custom pronouns field
  });

export default personalSchema;

