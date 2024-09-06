import { Dispatch, FC, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { EmailSchema, TEmailSchema } from "@/lib/validation/user";
import { getErrorMessage } from "@/lib/utils";
import { FormVariant } from "@/routes/_auth/login.lazy";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "@/lib/api/user";

interface ForgotFormProps {
  setDefaultEmail: Dispatch<SetStateAction<string>>;
  setFormVariant: Dispatch<SetStateAction<FormVariant>>;
}

const ForgotForm: FC<ForgotFormProps> = ({
  setDefaultEmail,
  setFormVariant,
}) => {
  const { toast } = useToast();

  const form = useForm<TEmailSchema>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form;

  const { mutateAsync } = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (_, email) => {
      setDefaultEmail(email);
      setFormVariant(FormVariant.forgotNew);
    },
    onError: (err) => {
      const message = getErrorMessage(err);

      if (message === "User not found") {
        setError("email", {
          message: "Invalid email.",
        });
      } else {
        return toast({
          variant: "destructive",
          title: "Error",
          description: "Oops... Something went wrong. Please try again",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<TEmailSchema> = async (data) => {
    await mutateAsync(data.email);
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
        <LoadingButton
          isLoading={isSubmitting}
          type="submit"
          className="w-full"
        >
          Continue
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ForgotForm;
