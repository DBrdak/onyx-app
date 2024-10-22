import { FC, useState } from "react";

import { ChevronDown } from "lucide-react";
import SelectCategoryLeft from "@/components/dashboard/budget/categoriesCard/selectCategory/SelectCategoryLeft";
import MiddleSection from "@/components/dashboard/budget/categoriesCard/selectCategory/SelectCategoryMiddle";

import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { type Category } from "@/lib/validation/category";
import { useBudgetActions, useCategoryId } from "@/store/dashboard/budgetStore";

interface SelectCategoryProps {
  category: Category;
}

export interface SelectCategorySectionProps {
  category: Category;
  isEdit: boolean;
  setIsEdit: (state: boolean) => void;
  isSelected: boolean;
}

const SelectCategory: FC<SelectCategoryProps> = ({ category }) => {
  const [isEdit, setIsEdit] = useState(false);
  const { id, optimistic } = category;
  const selectedCategoryId = useCategoryId();
  const { setCategoryId } = useBudgetActions();
  const isSelected = selectedCategoryId === id;

  const selectRef = useClickOutside<HTMLLIElement>(() => {
    setIsEdit(false);
  });

  const onSelect = () => {
    if (optimistic) return;
    setCategoryId(id);
  };

  return (
    <li
      ref={selectRef}
      className={cn(
        "cursor-pointer rounded-lg border border-input hover:bg-accent hover:text-accent-foreground",
        isSelected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        optimistic && "cursor-not-allowed opacity-70",
      )}
      onClick={onSelect}
    >
      <div
        className={cn("flex h-14 w-full items-center px-4", isEdit && "px-2")}
      >
        <div className="flex flex-1 items-center truncate">
          <SelectCategoryLeft
            category={category}
            isEdit={isEdit}
            isSelected={isSelected}
            setIsEdit={setIsEdit}
          />
          <MiddleSection
            category={category}
            isEdit={isEdit}
            isSelected={isSelected}
            setIsEdit={setIsEdit}
          />
        </div>
        {isEdit ? null : (
          <ChevronDown
            className={cn(
              "block flex-shrink-0 -rotate-90 text-muted-foreground transition-all duration-200 ease-in-out lg:rotate-0",
              isSelected && "rotate-0 text-primary-foreground lg:-rotate-90",
            )}
          />
        )}
      </div>
    </li>
  );
};

export default SelectCategory;
