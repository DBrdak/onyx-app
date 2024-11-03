import React, { FC, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { NameInputSchema, type TNameInputSchema } from "@/lib/validation/base";
import { getErrorMessage } from "@/lib/utils";
import { editUser } from "@/lib/api/user";
import { useSetUser } from "@/store/auth/authStore";

interface UserProfileEditNameFormProps {
  defaultName: string;
}

const UserProfileEditNameForm: FC<UserProfileEditNameFormProps> = ({
  defaultName,
}) => {
  const setUser = useSetUser();

  const form = useForm<TNameInputSchema>({
    defaultValues: {
      name: defaultName,
    },
    resolver: zodResolver(NameInputSchema),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
    setError,
  } = form;

  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isError } = useMutation({
    mutationKey: ["editUsername"],
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

  const onSubmit: SubmitHandler<TNameInputSchema> = (data) => {
    if (defaultName === data.name) return;

    mutate({ newUsername: data.name });
  };

  useEffect(() => {
    if (isError) {
      reset({
        name: defaultName,
      });
    }
  }, [isError, reset]);

  useEffect(() => {
    reset({
      name: defaultName,
    });
  }, [defaultName, reset]);

  const formRef = useClickOutside<HTMLFormElement>(() => {
    if (isDirty) {
      handleSubmit(onSubmit)();
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit)();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        onKeyDown={handleKeyDown}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem autoFocus={false}>
              <Input {...field} ref={inputRef} autoComplete="off" />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default UserProfileEditNameForm;
