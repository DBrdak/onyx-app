import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { formatToDecimalString, getErrorMessage } from "@/lib/utils";

const useAmountForm = ({
  defaultAmount,
  budgetId,
  mutationFn,
  onMutationSuccess,
}: {
  defaultAmount: number;
  budgetId: string;
  onMutationSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutationFn: (args: any) => Promise<any>;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultAmountFormatted = formatToDecimalString(defaultAmount);

  const form = useForm({
    defaultValues: {
      amount: defaultAmountFormatted,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty },
    reset,
  } = form;

  const { mutate, isError } = useMutation({
    mutationFn,
    onSettled: () => {
      queryClient.invalidateQueries(getCategoriesQueryOptions(budgetId));
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      const description = getErrorMessage(error);
      toast({
        title: "Error",
        description,
      });
    },
    onSuccess: () => {
      if (onMutationSuccess) {
        onMutationSuccess();
      }
    },
  });

  useEffect(() => {
    reset({
      amount: defaultAmountFormatted,
    });
  }, [defaultAmountFormatted, reset]);

  useEffect(() => {
    if (isError) {
      reset({ amount: defaultAmountFormatted });
    }
  }, [isError, reset]);

  return {
    form,
    handleSubmit,
    control,
    isDirty,
    mutate,
  };
};

export default useAmountForm;
