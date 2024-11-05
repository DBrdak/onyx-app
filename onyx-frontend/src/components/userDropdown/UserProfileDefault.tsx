import { FC } from "react";

import UserProfileEditNameForm from "@/components/userDropdown/UserProfileEditNameForm";
import UserProfileEditCurrencyForm from "@/components/userDropdown/UserProfileEditCurrencyForm";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { User } from "@/lib/validation/user";
import { useUserProfileStore } from "@/store/ui/userProfileStore";

interface UserProfileDefaultProps {
  user: User;
}

const UserProfileDefault: FC<UserProfileDefaultProps> = ({ user }) => {
  const setProfileVariant = useUserProfileStore.use.setProfileVariant();

  return (
    <>
      <div className="space-y-4">
        <DialogTitle>Edit name:</DialogTitle>
        <UserProfileEditNameForm defaultName={user.username} />
      </div>
      <div className="space-y-4">
        <DialogTitle>Edit currency:</DialogTitle>
        <UserProfileEditCurrencyForm defaultCurrency={user.currency} />
      </div>
      <div className="space-y-4">
        <DialogTitle>Email:</DialogTitle>
        <Input
          defaultValue={user.email}
          disabled
          className="w-full disabled:opacity-100"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Button
          variant="secondary"
          onClick={() => setProfileVariant("editEmailInput")}
        >
          Edit Email
        </Button>
        <Button
          variant="secondary"
          onClick={() => setProfileVariant("deleteAccount")}
        >
          Delete Account
        </Button>
      </div>
    </>
  );
};

export default UserProfileDefault;
