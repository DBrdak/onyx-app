import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/lib/hooks/useAuthContext";

import { useNavigate, useRouter } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/_home-layout/login")({
  component: Login,
});

function Login() {
  const router = useRouter();
  const navigate = useNavigate();
  const {
    auth: { login, isLoggingIn },
  } = useAuthContext();

  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { control, handleSubmit } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const isLoggedIn = await login(data.email, data.password);

      if (isLoggedIn) {
        await router.invalidate();
        await navigate({ to: "/budget" });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center pt-20">
      <Card>
        <CardHeader>Sign in</CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Input {...field} placeholder="Email..." />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password..."
                    />
                  </FormItem>
                )}
              />
              <LoadingButton isLoading={isLoggingIn} type="submit">
                Sign in
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
