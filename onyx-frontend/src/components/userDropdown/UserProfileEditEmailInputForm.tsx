import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { EditEmailSchema, type TEditEmailSchema } from "@/lib/validation/user";
import { changeEmail } from "@/lib/api/user";
import { getErrorMessage } from "@/lib/utils";
import {
  useUserProfileActions,
  useUserProfileNewEmail,
} from "@/store/ui/userProfileStore";
import UserProfileDialogNavigation from "./UserProfileDialogNavigation";

interface UserProfileEditEmailInputFormProps {
  defaultEmail: string;
}

const UserProfileEditEmailInputForm: FC<UserProfileEditEmailInputFormProps> = ({
  defaultEmail,
}) => {
  const storedEmail = useUserProfileNewEmail();
  const { setNewEmail, setProfileVariant } = useUserProfileActions();

  const form = useForm<TEditEmailSchema>({
    defaultValues: {
      currentEmail: defaultEmail,
      newEmail: storedEmail,
    },
    resolver: zodResolver(EditEmailSchema),
  });

  const {
    handleSubmit,
    control,
    setError,
    watch,
    formState: { isSubmitting },
  } = form;
  const newEmaiValue = watch("newEmail");

  const { mutateAsync } = useMutation({
    mutationKey: ["changeUserEmail"],
    mutationFn: changeEmail,
    onError: (error) => {
      const message = getErrorMessage(error);
      setError("newEmail", {
        message,
      });
    },
    onSuccess: () => {
      setNewEmail(newEmaiValue);
      setProfileVariant("editEmailSubmit");
    },
  });

  const onSubmit: SubmitHandler<TEditEmailSchema> = async (data) => {
    if (data.currentEmail === data.newEmail) return;
    await mutateAsync();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <UserProfileDialogNavigation
        title="Enter new email"
        onBack={() => setProfileVariant("default")}
      />
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-4 pt-4"
        >
          <FormField
            control={control}
            name="currentEmail"
            render={() => (
              <FormItem>
                <FormLabel>Current Email</FormLabel>
                <Input
                  autoComplete="off"
                  disabled
                  defaultValue={defaultEmail}
                  className="disabled:opacity-100"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="New email..."
                    autoFocus={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" pt-6">
            <LoadingButton
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Continue
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserProfileEditEmailInputForm;
