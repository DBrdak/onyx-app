import { FC, useState } from "react";

import { Ellipsis } from "lucide-react";
import BudgetsTableDeleteDialogContent from "@/components/dashboard/budget/budgetsTable/BudgetsTableDeleteDialogContent";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type Budget } from "@/lib/validation/budget";

interface BudgetsTableDropdownProps {
  budget: Budget;
  disabled: boolean;
}

enum OPTION {
  members = "MEMBERS",
  name = "NAME",
  delete = "DELETE",
  none = "NONE",
}

const BudgetsTableDropdown: FC<BudgetsTableDropdownProps> = ({
  budget,
  disabled,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [option, setOption] = useState(OPTION.none);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" disabled={disabled}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{budget.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOption(OPTION.members)}>
            <DialogTrigger>Manage members</DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOption(OPTION.name)}>
            Edit name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOption(OPTION.delete)}>
            <DialogTrigger>Delete budget</DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {option === OPTION.delete && (
        <BudgetsTableDeleteDialogContent
          budget={budget}
          setDialogOpen={setIsDialogOpen}
        />
      )}
      {option === OPTION.members && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage members</DialogTitle>
            <DialogDescription>
              Invite new members to your budget or remove them.
            </DialogDescription>
          </DialogHeader>
          <div>remove users</div>
          <div>invitation link</div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default BudgetsTableDropdown;
