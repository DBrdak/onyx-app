import { FC, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { ChevronDown, LoaderCircle } from "lucide-react";
import UserAvatar from "@/components/userDropdown/UserAvatar";
import UserProfileDialogContent from "@/components/userDropdown/UserProfileDialogContent";
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
import { useUserProfileStore } from "@/store/ui/userProfileStore";

interface UserDropdownProps {
  user: User;
  isSidebar?: boolean;
}

const UserDropdown: FC<UserDropdownProps> = ({ user, isSidebar }) => {
  const isDeletingUser = useUserProfileStore.use.isDeleting();
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

  if (isLoading || isDeletingUser)
    return (
      <>
        <div className="fixed inset-0 z-50 bg-muted/20" />
        <Button variant="ghost" disabled={!user || isLoading}>
          <LoaderCircle className="animate-spin" />
        </Button>
      </>
    );

  return (
    <Dialog>
      <DropdownMenu>
        {isSidebar ? (
          <DropdownMenuTrigger
            asChild
            disabled={!user || isLoading}
            className="block cursor-pointer rounded-l-full py-2 pl-9 pr-4 transition-all duration-500 hover:bg-accent hover:text-foreground"
          >
            <span className="flex items-center justify-between">
              <p className="flex items-center space-x-4">
                <UserAvatar />
                <span className="truncate text-sm font-semibold tracking-wide">
                  {user.username}
                </span>
              </p>
              <ChevronDown className="size-6 shrink-0 -rotate-90 opacity-60" />
            </span>
          </DropdownMenuTrigger>
        ) : (
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
        )}

        <DropdownMenuContent
          className="max-w-[150px]"
          align="end"
          sideOffset={5}
          side={isSidebar ? "right" : "bottom"}
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
