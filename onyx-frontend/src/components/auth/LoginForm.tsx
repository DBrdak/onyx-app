import { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormFooter from "@/components/auth/FormFooter";
import { PasswordInput } from "@/components/auth/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAuthContext } from "@/lib/hooks/useAuthContext";
import { LoginSchema, TLoginSchema } from "@/lib/validation/user";
import { getErrorMessage } from "@/lib/utils";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { useQueryClient } from "@tanstack/react-query";
import { getBudgetsQueryOptions } from "@/lib/api/budget";

interface LoginFormProps {
  setFormVariant: Dispatch<SetStateAction<FormVariant>>;
}

const LoginForm: FC<LoginFormProps> = ({ setFormVariant }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { redirect } = useSearch({ from: "/_auth/login" });
  const { toast } = useToast();

  const {
    auth: { login },
  } = useAuthContext();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit: SubmitHandler<TLoginSchema> = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      await queryClient.prefetchQuery(getBudgetsQueryOptions);
      if (redirect) {
        router.history.push(redirect);
      } else {
        await router.navigate({ to: "/budget" });
      }
    } catch (error) {
      const message = getErrorMessage(error);

      if (message === "User not found") {
        setError("email", {
          message: "Invalid email.",
        });
      } else if (message === "Invalid credentials") {
        setError("password", {
          message: "Invalid password.",
        });
      } else if (message === "Email is not verified") {
        setError("email", { message });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Oops... Something went wrong. Please try again",
        });
      }
    } finally {
      setIsLoading(false);
    }
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
              <FormLabel>Password</FormLabel>
              <PasswordInput {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-4">
          <LoadingButton isLoading={isLoading} type="submit" className="w-full">
            Sign in
          </LoadingButton>
        </div>
        <div className="flex flex-col items-start space-y-1">
          <Button
            disabled={isLoading}
            type="button"
            onClick={() => setFormVariant(FormVariant.forgotRequest)}
            variant="underline"
            className="h-6 px-0 py-0"
          >
            Forgot Password?
          </Button>
          <Button
            disabled={isLoading}
            type="button"
            onClick={() => setFormVariant(FormVariant.forgotVerify)}
            variant="underline"
            className="h-6 px-0 py-0"
          >
            Forgot to verify email?
          </Button>
        </div>
      </form>
      <FormFooter disabled={isLoading} />
    </Form>
  );
};

export default LoginForm;
