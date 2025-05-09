import { z } from "zod"

const profileSchema = z.object({
  bio: z.string().max(100, "The bio has to be less than 100 characters"),
})

export default profileSchema;
