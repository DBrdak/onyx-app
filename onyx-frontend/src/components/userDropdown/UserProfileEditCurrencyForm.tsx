import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import CurrencyCombobox from "@/components/dashboard/CurrencyCombobox";
import { Form, FormField } from "@/components/ui/form";

import { useSetUser } from "@/store/auth/authStore";
import {
  type TNameInputSchema,
  type Currency,
  NameInputSchema,
} from "@/lib/validation/base";
import { editUser } from "@/lib/api/user";
import { getErrorMessage } from "@/lib/utils";

interface UserProfileEditCurrencyFormProps {
  defaultCurrency: Currency;
}

const UserProfileEditCurrencyForm: FC<UserProfileEditCurrencyFormProps> = ({
  defaultCurrency,
}) => {
  const setUser = useSetUser();

  const form = useForm<TNameInputSchema>({
    defaultValues: {
      name: defaultCurrency,
    },
    resolver: zodResolver(NameInputSchema),
  });

  const { mutate, isError } = useMutation({
    mutationKey: ["editUserCurrency"],
    mutationFn: editUser,
    onError: (error) => {
      console.error("Mutation error:", error);
      const message = getErrorMessage(error);
      setError("name", {
        message,
      });
    },
    onSuccess: (newUser) => {
      setUser(newUser);
    },
  });

  const { handleSubmit, control, reset, setError, setValue } = form;

  const onSubmit: SubmitHandler<TNameInputSchema> = (data) => {
    if (defaultCurrency === data.name) return;

    mutate({ newCurrency: data.name });
  };

  useEffect(() => {
    if (isError) {
      reset({
        name: defaultCurrency,
      });
    }
  }, [isError, reset]);

  useEffect(() => {
    reset({
      name: defaultCurrency,
    });
  }, [defaultCurrency, reset]);

  return (
    <Form {...form}>
      <form>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <CurrencyCombobox
              selectedValue={field.value}
              onChange={(newCurrency) => {
                setValue("name", newCurrency);
                handleSubmit(onSubmit)();
              }}
              className="font-normal"
            />
          )}
        />
      </form>
    </Form>
  );
};

export default UserProfileEditCurrencyForm;
