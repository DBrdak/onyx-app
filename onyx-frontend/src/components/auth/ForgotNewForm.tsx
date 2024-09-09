import { Dispatch, FC, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PasswordInput } from "@/components/auth/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  ForgotPasswordNewSchema,
  type TForgotPasswordNewSchema,
} from "@/lib/validation/user";
import { forgotPasswordNew, ForgotPasswordNewPayload } from "@/lib/api/user";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { getErrorMessage } from "@/lib/utils";

interface ForgotNewFormProps {
  defaultEmail: string;
  setFormVariant: Dispatch<SetStateAction<FormVariant>>;
}

const ForgotNewForm: FC<ForgotNewFormProps> = ({
  defaultEmail,
  setFormVariant,
}) => {
  const form = useForm<TForgotPasswordNewSchema>({
    resolver: zodResolver(ForgotPasswordNewSchema),
    defaultValues: {
      email: defaultEmail,
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
  } = form;

  const { mutateAsync } = useMutation({
    mutationFn: forgotPasswordNew,
    onSuccess: () => {
      setFormVariant(FormVariant.login);
    },
    onError: (err) => {
      const message = getErrorMessage(err);

      console.log(message);

      if (message === "Invalid verification code") {
        setError("verificationCode", {
          message,
        });
      } else if (message === "User not found") {
        setError("email", {
          message: "Invalid email.",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<TForgotPasswordNewSchema> = async ({
    email,
    password,
    verificationCode,
  }) => {
    const payload: ForgotPasswordNewPayload = {
      email,
      newPassword: password,
      verificationCode,
    };

    await mutateAsync(payload);
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto w-full max-w-sm space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} placeholder="Email" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <PasswordInput {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <PasswordInput {...field} placeholder="Confirm password" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <LoadingButton
            isLoading={isSubmitting}
            type="submit"
            className="w-full"
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default ForgotNewForm;
