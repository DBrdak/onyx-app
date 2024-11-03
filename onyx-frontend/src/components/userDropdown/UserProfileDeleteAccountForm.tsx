import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import UserProfileDialogNavigation from "@/components/userDropdown/UserProfileDialogNavigation";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUserProfileActions } from "@/store/ui/userProfileStore";
import {
  RequiredStringValueSchema,
  TRequiredValueStringSchema,
} from "@/lib/validation/base";
import { deleteUser } from "@/lib/api/user";
import { getErrorMessage } from "@/lib/utils";
import { useReset } from "@/store/auth/authStore";
import { useRemoveLongLivedToken } from "@/store/auth/longLivedTokenStore";
import { resetAllUiStores } from "@/store/ui/boundUiStores";
import { resetAllStores } from "@/store/dashboard/boundDashboardStore";

interface UserProfileDeleteAccountFormProps {}

const UserProfileDeleteAccountForm: FC<
  UserProfileDeleteAccountFormProps
> = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { setProfileVariant, setIsDeleting } = useUserProfileActions();
  const resetAuthStore = useReset();
  const removeLongLivedToken = useRemoveLongLivedToken();

  const form = useForm<TRequiredValueStringSchema>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(RequiredStringValueSchema),
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUser,
    onError: (error) => {
      const message = getErrorMessage(error);
      setError("value", {
        message,
      });
    },
    onSuccess: async () => {
      setIsDeleting(true);
      queryClient.clear();
      resetAllUiStores();
      resetAllStores();
      resetAuthStore();
      removeLongLivedToken();
      await router.invalidate();
      await router.navigate({ to: "/" });
    },
  });

  const onSubmit: SubmitHandler<TRequiredValueStringSchema> = async ({
    value,
  }) => {
    await mutateAsync(value);
  };

  return (
    <>
      <UserProfileDialogNavigation
        title="Delete Account"
        onBack={() => setProfileVariant("default")}
      />
      <p className="font-medium text-muted-foreground">
        Deleting your account will permanently remove all your budgets,
        settings, and associated data. This action cannot be undone. You will
        lose access to any content or services associated with your account.
      </p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="Password..."
                  autoFocus={true}
                  className="focus-visible:ring-destructive"
                  type="password"
                />
                <FormMessage />
                <FormDescription>
                  Please enter your password to confirm this action.
                </FormDescription>
              </FormItem>
            )}
          />
          <div className=" pt-6">
            <LoadingButton
              type="submit"
              className="w-full"
              variant="destructive"
              isLoading={isSubmitting}
            >
              Delete
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserProfileDeleteAccountForm;
