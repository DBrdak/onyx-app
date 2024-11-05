import { FC } from "react";

import UnderlinedDialogContent from "@/components/UnderlinedDialogContent";
import UserProfileDefault from "@/components/userDropdown/UserProfileDefault";
import UserProfileEditEmailInputForm from "@/components/userDropdown/UserProfileEditEmailInputForm";

import { type User } from "@/lib/validation/user";
import UserProfileEditEmailSubmitForm from "./UserProfileEditEmailSubmitForm";
import UserProfileDeleteAccountForm from "./UserProfileDeleteAccountForm";
import { useUserProfileStore } from "@/store/ui/userProfileStore";

interface UserProfileDialogContentProps {
  user: User;
}

const UserProfileDialogContent: FC<UserProfileDialogContentProps> = ({
  user,
}) => {
  const userProfileVariant = useUserProfileStore.use.profileVariant();

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
