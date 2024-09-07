import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";

import Logo from "@/components/Logo";
import TypedHeader from "@/components/auth/TypedHeader";
import LoginForm from "@/components/auth/LoginForm";
import ForgotForm from "@/components/auth/ForgotForm";
import ForgotNewForm from "@/components/auth/ForgotNewForm";
import RegisterForm from "@/components/auth/RegisterForm";
import VerifyForm from "@/components/auth/VerifyForm";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { forgotPasswordRequest, forgotVerify } from "@/lib/api/user";

export const Route = createLazyFileRoute("/_auth/login")({
  component: Login,
});

export enum FormVariant {
  login = "LOGIN",
  register = "REGISTER",
  forgotRequest = "FORGOT_REQUEST",
  forgotNew = "FORGOT_NEW",
  verify = "VERIFY",
  forgotVerify = "FORGOT_VERIFY",
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
            "mr-auto flex max-w-5xl flex-col items-center space-y-16",
            formVariant === FormVariant.register && "space-y-4",
            formVariant === FormVariant.forgotNew && "space-y-10",
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
          <div
            className={cn(
              "w-full",
              formVariant === FormVariant.register && "pb-3",
            )}
          >
            {formVariant === FormVariant.login && (
              <LoginForm setFormVariant={setFormVariant} />
            )}
            {formVariant === FormVariant.forgotRequest && (
              <ForgotForm
                setDefaultEmail={setDefaultEmail}
                setFormVariant={() => setFormVariant(FormVariant.forgotNew)}
                mutationFn={forgotPasswordRequest}
              />
            )}
            {formVariant === FormVariant.forgotNew && (
              <ForgotNewForm
                defaultEmail={defaultEmail}
                setFormVariant={setFormVariant}
              />
            )}
            {formVariant === FormVariant.register && (
              <RegisterForm
                setFormVariant={setFormVariant}
                setDefaultEmail={setDefaultEmail}
              />
            )}
            {formVariant === FormVariant.verify && (
              <VerifyForm
                setFormVariant={setFormVariant}
                defaultEmail={defaultEmail}
              />
            )}
            {formVariant === FormVariant.forgotVerify && (
              <ForgotForm
                setFormVariant={() => setFormVariant(FormVariant.verify)}
                setDefaultEmail={setDefaultEmail}
                mutationFn={forgotVerify}
              />
            )}
          </div>
          <div className="relative flex w-full justify-center border-b">
            <p className="absolute -translate-y-1/2 bg-background px-2 text-3xl text-accent-foreground/80">
              or
            </p>
          </div>
          <div
            className={cn(
              "mx-auto w-full max-w-sm",
              formVariant === FormVariant.register && "pt-3",
            )}
          >
            <Button variant="outline" className="w-full ">
              Continue with Google
            </Button>
          </div>
          <p className="mx-auto w-full max-w-md text-xs">
            By signing up to ONYX you consent and agree to ONYX privacy policy
            to store, manage and process your personal information. To read
            more, please see our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
