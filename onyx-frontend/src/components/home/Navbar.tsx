import { Link } from "@tanstack/react-router";

import Brand from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/hooks/useAuthContext";
import UserDropdown from "../dashboard/UserDropdown";

const Navbar = () => {
  const {
    auth: { user, logout },
  } = useAuthContext();

  return (
    <div className="z-50 flex w-full items-center justify-between bg-background p-4">
      <Link to="/" className="ml-4 md:ml-32">
        <Brand className="text-foreground " />
      </Link>

      <div className="space-x-2">
        {user ? (
          <UserDropdown user={user} logout={logout} />
        ) : (
          <Link
            to="/login"
            activeProps={{
              className: "bg-accent",
            }}
            className={cn(
              buttonVariants({
                variant: "outline",
                className: "rounded-full font-bold tracking-wide",
              }),
            )}
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};
export default Navbar;
