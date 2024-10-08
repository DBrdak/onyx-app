import { FC } from "react";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlusMinusButtonProps {
  state: "+" | "-";
  setState: (state: "+" | "-") => void;
  className?: string;
}

const PlusMinusButton: FC<PlusMinusButtonProps> = ({
  state,
  setState,
  className,
}) => {
  const handleClick = () => {
    setState(state === "+" ? "-" : "+");
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      size="icon"
      className={cn(
        state === "+"
          ? "text-primary hover:text-primary"
          : "text-destructive hover:text-destructive",
        className,
      )}
    >
      {state === "+" ? <Plus /> : <Minus />}
    </Button>
  );
};

export default PlusMinusButton;
