import { FC, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatisticsDateNavbarYearSelectProps {
  tempSelectedYear: string;
  setTempSelectedYear: (newYear: string) => void;
}

const StatisticsDateNavbarYearSelect: FC<
  StatisticsDateNavbarYearSelectProps
> = ({ tempSelectedYear, setTempSelectedYear }) => {
  const availableYears = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) =>
        (new Date().getFullYear() - i).toString(),
      ),
    [],
  );

  return (
    <Select value={tempSelectedYear} onValueChange={setTempSelectedYear}>
      <SelectTrigger className="w-full bg-transparent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableYears.map((y) => (
          <SelectItem value={y} key={y}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatisticsDateNavbarYearSelect;
