import { z } from "zod"


const accountSchema = z.object({
  username: z.string().min(3, "The username needs to be at least 3 characters").max(25, "The username needs to be less than 25 characters"),
  email: z.string().email("The email is invalid"),
  password: z.string().min(8, "The password is too short"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "The passwords are not equal"
})

export default accountSchema;
