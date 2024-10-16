import { Link } from "@tanstack/react-router";

import Brand from "@/components/Logo";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useUser } from "@/store/auth/authStore";

const Navbar = () => {
  const user = useUser();

  return (
    <div className="z-50 flex w-full items-center justify-between bg-background p-4">
      <Link to="/" className="ml-4 md:ml-32">
        <Brand className="text-foreground " />
      </Link>

      <div className="space-x-2">
        {user ? (
          <UserDropdown user={user} />
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
