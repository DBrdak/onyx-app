import { z } from "zod";
import { MoneySchema, RequiredString, ResultSchema } from "./base";
import { SubcategorySchema } from "./subcategory";

export const CategoryStatSchema = z.object({
  categoryId: RequiredString,
  categoryName: RequiredString,
  subcategories: z.array(SubcategorySchema),
  totalAssignment: MoneySchema,
  totalSpending: MoneySchema,
  monthStats: z.array(z.any()),
});

export type CategoryStat = z.infer<typeof CategoryStatSchema>;

export const CategoryStatSchemaResult = ResultSchema.extend({
  value: z.object({
    categoriesStats: z.array(CategoryStatSchema),
  }),
});
