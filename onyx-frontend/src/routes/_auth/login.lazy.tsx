import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";

import Logo from "@/components/Logo";
import TypedHeader from "@/components/auth/TypedHeader";
import LoginForm from "@/components/auth/LoginForm";
import ForgotForm from "@/components/auth/ForgotForm";
import ForgotNewForm from "@/components/auth/ForgotNewForm";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export const Route = createLazyFileRoute("/_auth/login")({
  component: Login,
});

export enum FormVariant {
  login = "LOGIN",
  register = "REGISTER",
  forgotRequest = "FORGOT_REQUEST",
  forgotNew = "FORGOT_NEW",
}

function Login() {
  const [formVariant, setFormVariant] = useState(FormVariant.login);
  const [defaultEmail, setDefaultEmail] = useState("");

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
        <div
          className={cn(
            "mr-auto flex max-w-5xl flex-col items-center space-y-20",
            (formVariant === FormVariant.register ||
              formVariant === FormVariant.forgotNew) &&
              "md:space-y-10",
          )}
        >
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
          {formVariant === FormVariant.login && (
            <LoginForm setFormVariant={setFormVariant} />
          )}
          {formVariant === FormVariant.forgotRequest && (
            <ForgotForm
              setDefaultEmail={setDefaultEmail}
              setFormVariant={setFormVariant}
            />
          )}
          {formVariant === FormVariant.forgotNew && (
            <ForgotNewForm
              defaultEmail={defaultEmail}
              setFormVariant={setFormVariant}
            />
          )}
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
