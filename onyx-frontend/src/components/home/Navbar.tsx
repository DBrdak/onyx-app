import { Link } from "@tanstack/react-router";

import Brand from "@/components/Logo";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="max-w-1196px mt-6 flex justify-between bg-background  px-4 md:px-32">
      <div className="mt-4 flex h-30px cursor-pointer items-center">
        <Link to="/">
          <Brand className="text-foreground " />
        </Link>
      </div>
      <div className="z-30">
        <Button
          asChild
          variant="outline"
          className="rounded-full font-bold tracking-wide"
        >
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
};
export default Navbar;
