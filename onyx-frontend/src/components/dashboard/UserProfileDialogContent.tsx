import { FC } from "react";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type User } from "@/lib/validation/user";

interface UserProfileDialogContentProps {
  user: User;
}

const UserProfileDialogContent: FC<UserProfileDialogContentProps> = ({
  user,
}) => {
  return (
    <DialogContent className="h-full md:h-auto md:max-h-full">
      <DialogHeader>
        <DialogTitle>Profile</DialogTitle>
      </DialogHeader>
      <ul className="space-y-4 pb-5 pt-10 text-lg">
        <li>
          <span>Name: </span>
          {user.username}
        </li>
        <li>
          <span>Email: </span>
          {user.email}
        </li>
        <li>
          <span>Currency: </span>
          {user.currency}
        </li>
      </ul>
    </DialogContent>
  );
};

export default UserProfileDialogContent;
