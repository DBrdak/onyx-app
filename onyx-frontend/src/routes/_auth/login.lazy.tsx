import { Link } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";

import Logo from "@/components/Logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TypedHeader from "@/components/auth/TypedHeader";
import LoginForm from "@/components/auth/LoginForm";

export const Route = createLazyFileRoute("/_auth/login")({
  component: Login,
});

export enum FormVariant {
  login = "LOGIN",
  register = "REGISTER",
}

function Login() {
  const [formVariant, setFormVariant] = useState(FormVariant.login);

  return (
    <div className="grid h-full grid-cols-1 md:min-h-screen md:grid-cols-2 ">
      <div className="relative flex flex-col items-center space-y-6 bg-primary px-4 py-6">
        <Link to="/" className="md:absolute md:top-20">
          <Logo className="h-full w-full" />
        </Link>
        <div className="ml-auto flex h-full w-full max-w-5xl flex-col items-center">
          <TypedHeader formVariant={formVariant} />
        </div>
      </div>
      <div className="h-full px-6 pb-6 pt-10 md:pt-20">
        <div className="mr-auto flex max-w-5xl flex-col items-center space-y-20">
          <div className="flex flex-col items-center space-y-3 md:flex-row md:space-x-1 md:space-y-0">
            <Button
              onClick={() => setFormVariant(FormVariant.login)}
              className={cn(
                "h-auto w-full px-1 text-xl font-medium",
                formVariant === FormVariant.login && "before:scale-x-100",
              )}
              variant="underline"
            >
              Sign in
            </Button>
            <p className="text-xl">or</p>
            <Button
              onClick={() => setFormVariant(FormVariant.register)}
              className={cn(
                "h-auto w-full px-1 text-xl font-medium",
                formVariant === FormVariant.register && "before:scale-x-100",
              )}
              variant="underline"
            >
              create new account!
            </Button>
          </div>
          {formVariant === FormVariant.login ? <LoginForm /> : "register"}
          <div className="relative flex w-full justify-center border-b">
            <p className="absolute -translate-y-1/2 bg-background px-2 text-3xl text-accent-foreground/80">
              or
            </p>
          </div>
          <Button variant="outline" className="mx-auto w-full max-w-sm">
            Continue with Google
          </Button>
          <p className="mx-auto w-full max-w-md text-sm">
            By signing up to ONYX you consent and agree to ONYX privacy policy
            to store, manage and process your personal information. To read
            more, please see our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
