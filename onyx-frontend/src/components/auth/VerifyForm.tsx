import { Dispatch, FC, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingButton from "@/components/LoadingButton";
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { VerifySchema, type TVerifySchema } from "@/lib/validation/user";
import { verifyEmail } from "@/lib/api/user";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { getErrorMessage } from "@/lib/utils";

interface VerifyFormProps {
  defaultEmail: string;
  setFormVariant: Dispatch<SetStateAction<FormVariant>>;
  setSwitchButtonsDisabled: (disabled: boolean) => void;
}

const VerifyForm: FC<VerifyFormProps> = ({
  defaultEmail,
  setFormVariant,
  setSwitchButtonsDisabled,
}) => {
  const form = useForm<TVerifySchema>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      email: defaultEmail,
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
    mutationFn: verifyEmail,
    onSuccess: () => {
      setFormVariant(FormVariant.login);
    },
    onError: (err) => {
      const message = getErrorMessage(err);

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

  const onSubmit: SubmitHandler<TVerifySchema> = async ({
    email,
    verificationCode,
  }) => {
    setSwitchButtonsDisabled(true);
    await mutateAsync({ email, verificationCode });
    setSwitchButtonsDisabled(false);
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
              <Input
                {...field}
                placeholder="Email"
                disabled
                className="disabled:opacity-100"
              />
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
              <FormDescription>
                Verification code has been sent to the email described above.
              </FormDescription>
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
            Verify
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default VerifyForm;
