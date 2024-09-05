import { FC } from "react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useAuthContext } from "@/lib/hooks/useAuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = ({}) => {
  const router = useRouter();
  const { redirect } = useSearch({ from: "/_auth/login" });

  const {
    auth: { login, isLoading },
  } = useAuthContext();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const isLoggedIn = await login(data.email, data.password);

      if (isLoggedIn) {
        if (redirect) {
          router.history.push(redirect);
        } else {
          await router.navigate({ to: "/budget" });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", {
        type: "manual",
        message: "An error occurred during login. Please try again.",
      });
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
              <Input {...field} type="email" placeholder="Email" />
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
              <Input {...field} type="password" placeholder="Password" />
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-red-500">{form.formState.errors.root.message}</p>
        )}
        <LoadingButton isLoading={isLoading} type="submit" className="w-full">
          Sign in
        </LoadingButton>
      </form>
    </Form>
  );
};

export default LoginForm;
