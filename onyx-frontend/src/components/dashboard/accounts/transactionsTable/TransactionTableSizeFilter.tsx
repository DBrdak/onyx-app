import { FC, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

const TABLE_SIZE_OPTIONS = [
  {
    value: "7",
    label: "Default",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "30",
    label: "30",
  },
  {
    value: "40",
    label: "40",
  },
];

interface TransactionTableSizeFilterProps {
  disabled?: boolean;
}

const TransactionTableSizeFilter: FC<TransactionTableSizeFilterProps> = ({
  disabled,
}) => {
  const { tableSize } = useSearch({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });
  const navigate = useNavigate();

  const [size, setSize] = useState(tableSize || "7");

  const onSelect = async (value: string) => {
    if (value === tableSize) return;
    setSize(value);
    await navigate({
      search: (prev) => ({ ...prev, tableSize: value }),
    });
  };

  return (
    <Select value={size} onValueChange={(value) => onSelect(value)}>
      <SelectTrigger className="md:max-w-28" disabled={disabled}>
        <SelectValue placeholder="Table size" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Table size</SelectLabel>
          {TABLE_SIZE_OPTIONS.map(({ value, label }, index) => (
            <SelectItem value={value} key={index}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TransactionTableSizeFilter;
