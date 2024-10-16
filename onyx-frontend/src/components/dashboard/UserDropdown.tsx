import { FC, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { ChevronDown, LoaderCircle } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import UserProfileDialogContent from "@/components/dashboard/UserProfileDialogContent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type User } from "@/lib/validation/user";
import { useLogout } from "@/lib/hooks/auth/useLogout";

interface UserDropdownProps {
  user: User;
}

const UserDropdown: FC<UserDropdownProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      await router.invalidate();
      await router.navigate({ to: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <Button variant="ghost" disabled={!user || isLoading}>
        <LoaderCircle className="animate-spin" />
      </Button>
    );

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between space-x-2 rounded-full border-none p-0 pr-1 duration-500"
            disabled={!user || isLoading}
          >
            <UserAvatar />
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={10}
          align="end"
          className="max-w-[150px]"
        >
          <DropdownMenuLabel className="truncate text-center capitalize">
            {user.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
        <UserProfileDialogContent user={user} />
      </DropdownMenu>
    </Dialog>
  );
};

export default UserDropdown;
