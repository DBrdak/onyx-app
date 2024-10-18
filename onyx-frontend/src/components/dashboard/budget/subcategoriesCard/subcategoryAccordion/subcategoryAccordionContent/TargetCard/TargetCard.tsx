import { FC, useState } from "react";

import TargetCardList from "./TargetCardList";
import TargetCardForm from "./TargetCardForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Subcategory } from "@/lib/validation/subcategory";
import { useBudgetMonth } from "@/store/dashboard/budgetStore";
import { Currency } from "@/lib/validation/base";

interface TargetCardProps {
  subcategory: Subcategory;
  currencyToDisplay: Currency;
}

const TargetCard: FC<TargetCardProps> = ({
  subcategory,
  currencyToDisplay,
}) => {
  const month = useBudgetMonth();
  const [isCreating, setIsCreating] = useState(false);
  const currentTarget = subcategory.target;
  const isAvailable = new Date().getMonth() + 1 <= month;

  return (
    <Card className="overflow-hidden rounded-lg border">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-center text-lg">Target</CardTitle>
      </CardHeader>
      <CardContent>
        {!currentTarget && !isAvailable && (
          <p className="pt-6 text-center">
            The target has been met or has not been set for this month.
          </p>
        )}
        {currentTarget && !isCreating && (
          <TargetCardList
            currencyToDisplay={currencyToDisplay}
            currentTarget={currentTarget}
            setIsCreating={setIsCreating}
          />
        )}
        {isCreating || (!currentTarget && isAvailable) ? (
          <TargetCardForm
            currentTarget={currentTarget}
            setIsCreating={setIsCreating}
            subcategoryId={subcategory.id}
            currencyToDisplay={currencyToDisplay}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TargetCard;
