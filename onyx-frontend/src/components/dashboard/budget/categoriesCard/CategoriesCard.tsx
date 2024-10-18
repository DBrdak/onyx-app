import { FC } from "react";

import SelectCategory from "@/components/dashboard/budget/categoriesCard/selectCategory/SelectCategory";
import CreateCategory from "@/components/dashboard/budget/categoriesCard/CreateCategory";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Category } from "@/lib/validation/category";

interface CategoriesCardProps {
  categories: Category[];
}

const CategoriesCard: FC<CategoriesCardProps> = ({ categories }) => {
  return (
    <ScrollArea className="h-full flex-grow rounded-lg border bg-card">
      <h2 className="sticky top-0 z-10 border-b bg-card p-6 text-center text-lg font-bold tracking-wide">
        Categories
      </h2>
      <ul className="space-y-4 p-6">
        {categories.map((category) => (
          <SelectCategory key={category.id} category={category} />
        ))}
        <CreateCategory categoriesCount={categories.length} />
      </ul>
    </ScrollArea>
  );
};

export default CategoriesCard;
