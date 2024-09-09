import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, placeholder, ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleMouseDown = () => setPasswordVisible(true);
    const handleMouseUp = () => setPasswordVisible(false);

    return (
      <div className="relative">
        <button
          type="button"
          className="absolute right-5 h-full"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {passwordVisible ? <Eye /> : <EyeOff />}
        </button>
        <Input
          type={passwordVisible ? "text" : "password"}
          placeholder={placeholder || "Password"}
          className={cn("w-full pr-16", className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
