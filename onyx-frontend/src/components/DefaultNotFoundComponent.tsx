import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

const DefaultNotFoundComponent = () => {
  return (
    <div className="flex h-screen flex-col items-center space-y-20 bg-primaryDark px-4 pt-28 md:pt-40">
      <Logo />
      <Card className="relative mx-4 w-full max-w-[450px]">
        <CardHeader>
          <CardTitle className="text-center">
            Oops, this page does not exist.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Change your url to existing one or just navigate to home page.</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link to={"/"}>Home Page</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DefaultNotFoundComponent;
