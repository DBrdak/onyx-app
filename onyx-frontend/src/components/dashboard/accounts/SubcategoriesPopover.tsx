import { FC, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSelectableCategories } from "@/lib/hooks/useSelectableCategories";

interface SubcategoriesPopoverProps {
  selectedSubcategoryName: string | undefined | null;
  onChange: (value: string, label: string) => void;
  budgetId: string;
  disabled?: boolean;
}

const SubcategoriesPopover: FC<SubcategoriesPopoverProps> = ({
  selectedSubcategoryName,
  onChange,
  budgetId,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const selectableCategories = useSelectableCategories({ budgetId });

  const handleSelect = (value: string, label: string) => {
    onChange(value, label);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={disabled}
          size="sm"
        >
          {selectedSubcategoryName || "Select subcategory..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search subcategory..." />
          <CommandList className="scrollbar-thin">
            <CommandEmpty>No subcategory found.</CommandEmpty>
            {selectableCategories?.map((category) => (
              <CommandGroup key={category.value} heading={category.label}>
                {category.subcategories.map((subcategory) => (
                  <CommandItem
                    value={subcategory.label}
                    key={subcategory.value}
                    onSelect={() =>
                      handleSelect(subcategory.value, subcategory.label)
                    }
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        subcategory.value === selectedSubcategoryName
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {subcategory.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SubcategoriesPopover;
