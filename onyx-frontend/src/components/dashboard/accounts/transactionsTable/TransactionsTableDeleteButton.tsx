import { Dispatch, FC, SetStateAction } from "react";
import { Row, RowSelectionState } from "@tanstack/react-table";

import { Transaction } from "@/lib/validation/transaction";
import { useDeleteTransactionsMutation } from "@/lib/hooks/mutations/useDeleteTransactionsMutation";
import DeleteTransactionDialog from "../DeleteTransactionDialog";
import { useBudgetId } from "@/store/dashboard/budgetStore";
import { useAccountId } from "@/store/dashboard/accountStore";

interface TransactionsTableDeleteButtonProps {
  rows: Row<Transaction>[];
  setRowsSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

const TransactionsTableDeleteButton: FC<TransactionsTableDeleteButtonProps> = ({
  rows,
  setRowsSelection,
}) => {
  const budgetId = useBudgetId();
  const accountId = useAccountId();

  const { mutate, isError, error, reset } = useDeleteTransactionsMutation({
    budgetId,
    accountId,
  });

  const onDelete = () => {
    mutate({ budgetId, rows });
    setRowsSelection({});
  };

  return (
    <DeleteTransactionDialog
      isError={isError}
      onDelete={onDelete}
      rowsToDeleteLength={rows.length}
      error={error}
      reset={reset}
    />
  );
};

export default TransactionsTableDeleteButton;
