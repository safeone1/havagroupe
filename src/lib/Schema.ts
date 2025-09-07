import z from "zod";

export const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Invalid email address"),
    image: z.url("Invalid image URL").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignupSchemaType = z.infer<typeof SignupSchema>;

export const BrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters long"),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

export type BrandSchemaType = z.infer<typeof BrandSchema>;

export const ProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  brandId: z.string().min(1, "Brand is required"),
  categoryId: z.string().optional(),
  catalogueId: z.string().optional(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

export const CategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
  parentId: z.string().optional(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
