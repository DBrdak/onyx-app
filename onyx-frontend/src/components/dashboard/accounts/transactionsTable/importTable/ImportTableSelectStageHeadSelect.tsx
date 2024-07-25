import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface ImportTableSelectStageHeadSelectProps {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
  selectOptions: string[];
}

const ImportTableSelectStageHeadSelect: FC<
  ImportTableSelectStageHeadSelectProps
> = ({ columnIndex, selectedColumns, onChange, selectOptions }) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelection || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "boder-none w-full bg-transparent capitalize outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0",
          currentSelection && "text-primary",
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {selectOptions.map((option, index) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option;

          return (
            <SelectItem
              key={index}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ImportTableSelectStageHeadSelect;
