import { FC } from "react";
import { useNavigate } from "@tanstack/react-router";

import { ChevronDown } from "lucide-react";
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

import { useAuthContext } from "@/lib/hooks/useAuthContext";

interface UserDropdownProps {}

const UserDropdown: FC<UserDropdownProps> = () => {
  const {
    auth: { user, logout },
  } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    await navigate({ to: "/" });
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="justify-between space-x-2 rounded-full border-none p-0 pr-1 duration-500"
            disabled={!user}
          >
            <UserAvatar username={user?.username} />
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        {user && (
          <>
            <DropdownMenuContent
              sideOffset={10}
              align="end"
              className="max-w-[150px]"
            >
              <DropdownMenuLabel className="truncate text-center capitalize">
                {user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem onClick={handleLogout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
            <UserProfileDialogContent user={user} />
          </>
        )}
      </DropdownMenu>
    </Dialog>
  );
};

export default UserDropdown;
