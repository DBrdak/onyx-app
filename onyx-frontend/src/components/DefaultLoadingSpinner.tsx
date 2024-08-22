import { LoaderCircle } from "lucide-react";

const DefaultLoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary/40">
      <LoaderCircle className="size-32 flex-shrink-0 animate-spin text-primary" />
    </div>
  );
};

export default DefaultLoadingSpinner;
