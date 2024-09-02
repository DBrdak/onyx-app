import { FC, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CopyToClipboardProps {
  textToCopy: string;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard
      .writeText(textToCopy)
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
          onClick={copyText}
          size="icon"
          variant="outline"
          className="rounded-r-none"
        >
          <Copy />
        </Button>
        <Input
          value={textToCopy}
          disabled
          className="truncate rounded-l-none border-l-0 no-underline disabled:opacity-100"
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
