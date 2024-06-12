import { z } from "zod";
import {
  AssignmentSchema,
  MoneySchema,
  ResultSchema,
  TargetSchema,
} from "@/lib/validation/base";

export const SubcategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullish(),
  assigments: z.array(AssignmentSchema).optional(),
  target: TargetSchema.optional().nullish(),
  optimistic: z.boolean().optional(),
});
export type Subcategory = z.infer<typeof SubcategorySchema>;

export const CreateSubcategorySchema = z.object({
  name: z
    .string()
    .min(1, "Please provide subcategory name.")
    .regex(/^[a-zA-Z0-9\s.-]{1,50}$/, "Invalid subcategory name."),
});

export type CreateSubcategory = z.infer<typeof CreateSubcategorySchema>;

export const CreateAssignmentSchema = z.object({
  amount: z
    .string()
    .min(1, "Please provide subcategory name.")
    .regex(/\b\d+(?:\.\d{1,2})?\b/, "Invalid amount."),
});

export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;

export const ToAssignSchema = ResultSchema.extend({
  value: MoneySchema,
});
