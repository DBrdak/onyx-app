import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getCategoriesQueryOptions } from "@/lib/api/category";
import { formatToDecimalString } from "@/lib/utils";
import { getToAssignQueryOptions } from "../api/budget";

const useAmountForm = ({
  defaultAmount,
  budgetId,
  mutationFn,
  month,
  year,
}: {
  defaultAmount: number;
  budgetId: string;
  month: string;
  year: string;
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
    onSettled: async () => {
      return Promise.all([
        queryClient.invalidateQueries(getCategoriesQueryOptions(budgetId)),
        queryClient.invalidateQueries(
          getToAssignQueryOptions({ month, year, budgetId }),
        ),
      ]);
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: "Oops... Something went wrong. Please try again later.",
      });
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
