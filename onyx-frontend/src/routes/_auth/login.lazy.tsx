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
  const [switchButtonsDisabled, setSwitchButtonsDisabled] = useState(false);

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
          )}
        >
          <div className="flex flex-col items-center space-y-3 md:flex-row md:space-x-1 md:space-y-0">
            <Button
              disabled={switchButtonsDisabled}
              onClick={() => setFormVariant(FormVariant.login)}
              className={cn(
                "h-auto w-full px-1 text-xl font-medium",
                formVariant === FormVariant.login && "before:scale-x-100",
              )}
              variant="underline"
            >
              Sign in
            </Button>
            <p className={cn("text-xl", switchButtonsDisabled && "opacity-50")}>
              or
            </p>
            <Button
              disabled={switchButtonsDisabled}
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
              <LoginForm
                setFormVariant={setFormVariant}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
            {formVariant === FormVariant.forgotRequest && (
              <ForgotForm
                setDefaultEmail={setDefaultEmail}
                setFormVariant={() => setFormVariant(FormVariant.forgotNew)}
                mutationFn={forgotPasswordRequest}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
            {formVariant === FormVariant.forgotNew && (
              <ForgotNewForm
                defaultEmail={defaultEmail}
                setFormVariant={setFormVariant}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
            {formVariant === FormVariant.register && (
              <RegisterForm
                setFormVariant={setFormVariant}
                setDefaultEmail={setDefaultEmail}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
            {formVariant === FormVariant.verify && (
              <VerifyForm
                setFormVariant={setFormVariant}
                defaultEmail={defaultEmail}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
            {formVariant === FormVariant.forgotVerify && (
              <ForgotForm
                setFormVariant={() => setFormVariant(FormVariant.verify)}
                setDefaultEmail={setDefaultEmail}
                mutationFn={forgotVerify}
                setSwitchButtonsDisabled={setSwitchButtonsDisabled}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
