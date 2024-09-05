import { FC, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface TypedHeaderProps {
  formVariant: FormVariant;
}

const TypedHeader: FC<TypedHeaderProps> = ({ formVariant }) => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const triggerAnimation = () => {
    const element = h1Ref.current;
    if (element) {
      element.classList.remove("animate-typing");
      void element.offsetWidth;
      element.classList.add("animate-typing");
    }
  };

  useEffect(() => {
    if (isDesktop) {
      triggerAnimation();
    }
  }, []);

  useEffect(() => {
    if (isDesktop) {
      triggerAnimation();
    }
  }, [formVariant]);

  return (
    <div className="flex h-full max-w-md flex-col justify-center px-4 md:max-w-2xl xl:max-w-3xl">
      <h1
        ref={h1Ref}
        className={cn(
          "w-full text-center text-lg font-medium text-primary-foreground md:text-2xl 2xl:text-3xl",
          isDesktop &&
            "inline-block  animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-500",
        )}
      >
        {formVariant === FormVariant.login
          ? "Stay Connected with the ONYX Family! Sign In!"
          : "Unleash All Features and Join the ONYX Family!"}
      </h1>
    </div>
  );
};

export default TypedHeader;
