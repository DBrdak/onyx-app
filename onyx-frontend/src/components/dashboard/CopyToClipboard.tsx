import { FC, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyToClipboardProps {
  textToCopy?: string;
  isLoading?: boolean;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({
  textToCopy,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard
      .writeText(textToCopy!)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="relative">
      <div className="flex">
        <Button
          disabled={isLoading}
          onClick={copyText}
          size="icon"
          variant="outline"
          className="rounded-r-none"
        >
          <Copy />
        </Button>
        <Input
          value={isLoading ? "loading..." : textToCopy}
          disabled
          className={cn(
            "truncate rounded-l-none border-l-0 no-underline disabled:opacity-100",
            isLoading && "animate-pulse",
          )}
          style={{
            pointerEvents: "none",
          }}
        />
      </div>
      {copied && (
        <p className="absolute -bottom-6 text-sm text-primary">Copied!</p>
      )}
    </div>
  );
};

export default CopyToClipboard;
