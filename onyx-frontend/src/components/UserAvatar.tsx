import { FC } from "react";

import { LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatar?: string;
  username: string | undefined;
}

const UserAvatar: FC<UserAvatarProps> = ({ avatar, username }) => {
  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>
        <span className="flex aspect-square h-full items-center justify-center rounded-full border-none bg-transparent font-bold capitalize text-foreground">
          {!username ? <LoaderCircle className="animate-spin" /> : username[0]}
        </span>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
