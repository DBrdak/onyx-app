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
import { useMutation } from "@tanstack/react-query";

interface ForgotFormProps {
  setDefaultEmail: Dispatch<SetStateAction<string>>;
  setFormVariant: () => void;
  mutationFn: (email: string) => Promise<void>;
  setSwitchButtonsDisabled: (disabled: boolean) => void;
}

const ForgotForm: FC<ForgotFormProps> = ({
  setDefaultEmail,
  setFormVariant,
  mutationFn,
  setSwitchButtonsDisabled,
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
    mutationFn: mutationFn,
    onSuccess: (_, email) => {
      setDefaultEmail(email);
      setFormVariant();
    },
    onError: (err) => {
      const message = getErrorMessage(err);

      if (message === "User not found") {
        setError("email", {
          message: "Invalid email.",
        });
      } else if (
        message === "The verification code was not previously requested"
      ) {
        setError("email", {
          message,
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
    setSwitchButtonsDisabled(true);
    await mutateAsync(data.email);
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
              <Input {...field} placeholder="Email" />
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
            Continue
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default ForgotForm;
