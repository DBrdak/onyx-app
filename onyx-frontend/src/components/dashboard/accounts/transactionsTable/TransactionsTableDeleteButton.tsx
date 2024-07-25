import { Dispatch, FC, SetStateAction } from "react";
import { useParams } from "@tanstack/react-router";
import { Row, RowSelectionState } from "@tanstack/react-table";

import { Transaction } from "@/lib/validation/transaction";
import { useDeleteTransactionsMutation } from "@/lib/hooks/mutations/useDeleteTransactionsMutation";
import DeleteTransactionDialog from "../DeleteTransactionDialog";

interface TransactionsTableDeleteButtonProps {
  rows: Row<Transaction>[];
  setRowsSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

const TransactionsTableDeleteButton: FC<TransactionsTableDeleteButtonProps> = ({
  rows,
  setRowsSelection,
}) => {
  const { budgetId, accountId } = useParams({
    from: "/_dashboard-layout/budget/$budgetId/accounts/$accountId",
  });

  const { mutate, isError } = useDeleteTransactionsMutation({
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
    />
  );
};

export default TransactionsTableDeleteButton;
