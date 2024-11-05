import { FC } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useAccountStore } from "@/store/dashboard/accountStore";

const TABLE_SIZE_OPTIONS = [
  {
    value: "8",
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
  const tableSize = useAccountStore.use.accountTableSize();
  const setAccountTableSize = useAccountStore.use.setAccountTableSize();

  const onSelect = async (value: string) => {
    if (value === tableSize.toString()) return;
    setAccountTableSize(parseInt(value));
  };

  return (
    <Select
      value={tableSize.toString()}
      onValueChange={(value) => onSelect(value)}
    >
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
