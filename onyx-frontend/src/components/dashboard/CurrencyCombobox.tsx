import { FC, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { OTHER_CORRENCY, POPULAR_CURRENCY } from "@/lib/constants/currency";
import { cn } from "@/lib/utils";

interface CurrencyComboboxProps {
  disabled?: boolean;
  className?: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const CurrencyCombobox: FC<CurrencyComboboxProps> = ({
  disabled,
  selectedValue,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const handleChange = (value: string) => {
    onChange(value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between focus-visible:ring-0",
            className,
          )}
          disabled={disabled}
        >
          {selectedValue || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="scrollbar-thin">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup heading="Popular">
              {POPULAR_CURRENCY.map((c) => (
                <CommandItem
                  value={c.label}
                  key={c.value}
                  onSelect={(value) => handleChange(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      c.value === selectedValue ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Other">
              {OTHER_CORRENCY.map((c) => (
                <CommandItem
                  value={c.label}
                  key={c.value}
                  onSelect={(value) => handleChange(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      c.value === selectedValue ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencyCombobox;
