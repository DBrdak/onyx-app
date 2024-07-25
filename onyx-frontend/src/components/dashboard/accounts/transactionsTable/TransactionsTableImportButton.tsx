import { FC } from "react";
import { useCSVReader } from "react-papaparse";

import { Import } from "lucide-react";
import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TransactionsTableImportButtonProps {
  onUpload: (results: any) => void;
}

const TransactionsTableImportButton: FC<TransactionsTableImportButtonProps> = ({
  onUpload,
}) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button variant="outline" className="space-x-2" {...getRootProps()}>
          <Import className="inline-flex size-5 flex-shrink-0 opacity-90" />
          <span className="inline-flex">Import</span>
        </Button>
      )}
    </CSVReader>
  );
};

export default TransactionsTableImportButton;
