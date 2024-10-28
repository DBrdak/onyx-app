import { FC } from "react";
import { useRouter } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

const GlobalLoadingError: FC = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.invalidate();
    router.navigate({
      to: "/",
      replace: true,
    });
  };
  return (
    <div className="flex h-screen flex-col items-center space-y-20 bg-primaryDark px-4 pt-28 md:pt-40">
      <Logo />
      <Card className="relative mx-4 w-full max-w-[450px]">
        <CardHeader>
          <CardTitle className="text-center">
            Oops, an error occurred.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We are terribly sorry, but it seems we have some problems loading
            your content. Please try again or come back later.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRetry} className="w-full" variant="outline">
            Reload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GlobalLoadingError;
