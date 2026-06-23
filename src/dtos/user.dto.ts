import { z } from "zod";

// ── Register DTO ──
export const RegisterDto = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be under 50 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

// ── Login DTO ──
export const LoginDto = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;
export type LoginDtoType = z.infer<typeof LoginDto>;

// ── Update User DTO (profile fields) ──
export const UpdateProfileDto = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be under 50 characters")
    .optional(),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number")
    .optional(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>;

// ── Update Password fields (used via same /update endpoint) ──
export const UpdatePasswordFields = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordDtoType = z.infer<typeof UpdatePasswordFields>;