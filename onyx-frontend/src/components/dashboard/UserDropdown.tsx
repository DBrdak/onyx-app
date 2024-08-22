import { FC } from "react";
import { useNavigate } from "@tanstack/react-router";

import { ChevronDown, LoaderCircle } from "lucide-react";
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
            variant="outline"
            className="justify-between space-x-2 rounded-full bg-transparent p-0 pr-1 duration-700"
            disabled={!user}
          >
            <span className="inline-flex aspect-square h-full items-center justify-center rounded-full bg-primaryDark font-bold capitalize text-primaryDark-foreground">
              {!user?.username ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                user.username[0]
              )}
            </span>
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
