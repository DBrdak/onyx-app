import { FC } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface FormFooterProps {
  disabled: boolean;
  className?: string;
}

const FormFooter: FC<FormFooterProps> = ({ disabled, className }) => {
  return (
    <div className={cn("space-y-10 pt-12", className)}>
      <div className="relative flex w-full justify-center border-b">
        <p className="absolute -translate-y-1/2 bg-background px-2 text-3xl text-accent-foreground/80">
          or
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={disabled}
        >
          Continue with Google
        </Button>
      </div>
      <p className="mx-auto w-full max-w-md text-xs">
        By signing up to ONYX you consent and agree to ONYX privacy policy to
        store, manage and process your personal information. To read more,
        please see our privacy policy.
      </p>
    </div>
  );
};

export default FormFooter;
