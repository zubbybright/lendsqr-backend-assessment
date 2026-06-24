import { z } from "zod";

export const registerUserSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters"),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});