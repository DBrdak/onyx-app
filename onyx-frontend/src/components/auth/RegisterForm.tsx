import { Dispatch, FC, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import FormFooter from "@/components/auth/FormFooter";
import { PasswordInput } from "@/components/auth/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import CurrencyCombobox from "@/components/dashboard/CurrencyCombobox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { RegisterSchema, type TRegisterSchema } from "@/lib/validation/user";
import { register } from "@/lib/api/user";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { getErrorMessage } from "@/lib/utils";

interface RegisterFormProps {
  setFormVariant: Dispatch<SetStateAction<FormVariant>>;
  setDefaultEmail: Dispatch<SetStateAction<string>>;
  setSwitchButtonsDisabled: (disabled: boolean) => void;
}

const RegisterForm: FC<RegisterFormProps> = ({
  setFormVariant,
  setDefaultEmail,
  setSwitchButtonsDisabled,
}) => {
  const { toast } = useToast();
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      currency: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setError,
  } = form;

  const selectedCurrency = watch("currency");

  const { mutateAsync } = useMutation({
    mutationFn: register,
    onSuccess: (_, data) => {
      setDefaultEmail(data.email);
      setFormVariant(FormVariant.verify);
    },
    onError: (err) => {
      const message = getErrorMessage(err);
      console.log(message);

      if (message === "Email is already in use") {
        setError("email", { message });
      } else {
        return toast({
          variant: "destructive",
          title: "Error",
          description: "Oops... Something went wrong. Please try again",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<TRegisterSchema> = async ({
    username,
    password,
    email,
    currency,
  }) => {
    setSwitchButtonsDisabled(true);
    await mutateAsync({ username, currency, email, password });
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input {...field} placeholder="Name" />
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>Password</FormLabel>
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
          control={control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <CurrencyCombobox
                onChange={field.onChange}
                selectedValue={selectedCurrency}
              />
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
            Register
          </LoadingButton>
        </div>
      </form>
      <FormFooter disabled={isSubmitting} />
    </Form>
  );
};

export default RegisterForm;
