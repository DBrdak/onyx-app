import { FC } from "react";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

interface UserProfileDialogNavigationProps {
  onBack: () => void;
  title: string;
}

const UserProfileDialogNavigation: FC<UserProfileDialogNavigationProps> = ({
  onBack,
  title,
}) => {
  return (
    <div className="relative text-center">
      <Button
        variant="ghost"
        onClick={onBack}
        className="absolute -top-1/2 left-0 w-fit"
        size="sm"
      >
        <ArrowLeft />
      </Button>
      <DialogTitle>{title}</DialogTitle>
    </div>
  );
};

export default UserProfileDialogNavigation;
