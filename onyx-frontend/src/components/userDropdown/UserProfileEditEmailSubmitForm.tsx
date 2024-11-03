import { FC } from "react";
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
import { editUser } from "@/lib/api/user";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";
import {
  useUserProfileActions,
  useUserProfileNewEmail,
} from "@/store/ui/userProfileStore";
import UserProfileDialogNavigation from "./UserProfileDialogNavigation";
import { useSetUser } from "@/store/auth/authStore";

const UserProfileEditEmailSubmitForm: FC = () => {
  const newEmail = useUserProfileNewEmail();
  const { setNewEmail, setProfileVariant } = useUserProfileActions();
  const setUser = useSetUser();

  const form = useForm<TVerifySchema>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      email: newEmail,
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
    mutationFn: editUser,
    onSuccess: (newUserData) => {
      setUser(newUserData);
      setNewEmail("");
      setProfileVariant("default");
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
    await mutateAsync({ newEmail: email, verificationCode });
  };

  return (
    <>
      <UserProfileDialogNavigation
        title="Submit new email"
        onBack={() => setProfileVariant("editEmailInput")}
      />
      <Form {...form}>
        <form
          className="mx-auto w-full max-w-sm space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            control={control}
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>New Email</FormLabel>
                <Input defaultValue={newEmail} disabled />
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
                  <InputOTP maxLength={6} {...field} autoFocus={true}>
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
                <FormDescription>
                  Please check your current email for verification code.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="pt-4">
            <LoadingButton
              isLoading={isSubmitting}
              type="submit"
              className="w-full"
            >
              Change
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserProfileEditEmailSubmitForm;
