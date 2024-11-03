import { FC } from "react";

import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatar?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ avatar }) => {
  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>
        <User className="text-foreground" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
