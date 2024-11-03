import { FC } from "react";

import UnderlinedDialogContent from "@/components/UnderlinedDialogContent";
import UserProfileDefault from "@/components/userDropdown/UserProfileDefault";
import UserProfileEditEmailInputForm from "@/components/userDropdown/UserProfileEditEmailInputForm";

import { type User } from "@/lib/validation/user";
import { useUserProfileVariant } from "@/store/ui/userProfileStore";
import UserProfileEditEmailSubmitForm from "./UserProfileEditEmailSubmitForm";
import UserProfileDeleteAccountForm from "./UserProfileDeleteAccountForm";

interface UserProfileDialogContentProps {
  user: User;
}

const UserProfileDialogContent: FC<UserProfileDialogContentProps> = ({
  user,
}) => {
  const userProfileVariant = useUserProfileVariant();

  return (
    <UnderlinedDialogContent title="Profile">
      {userProfileVariant === "default" && <UserProfileDefault user={user} />}
      {userProfileVariant === "editEmailInput" && (
        <UserProfileEditEmailInputForm defaultEmail={user.email} />
      )}
      {userProfileVariant === "editEmailSubmit" && (
        <UserProfileEditEmailSubmitForm />
      )}
      {userProfileVariant === "deleteAccount" && (
        <UserProfileDeleteAccountForm />
      )}
    </UnderlinedDialogContent>
  );
};

export default UserProfileDialogContent;
