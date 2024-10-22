import { FC, ReactNode } from "react";

import { CreditCard } from "lucide-react";
import CreateAccountButton from "@/components/dashboard/accounts/CreateAccountButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "../ui/scroll-area";

interface AccountsLinksAccordionProps {
  accountsLength: number;
  children: ReactNode;
}

const AccountsLinksAccordion: FC<AccountsLinksAccordionProps> = ({
  accountsLength,
  children,
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="rouded-l-full pl-8 pr-4 hover:rounded-l-full hover:text-foreground xl:pl-9">
          <span className="space-x-4 overflow-hidden">
            <CreditCard className="inline-flex size-6 shrink-0" />
            <span className="inline-flex text-sm font-semibold tracking-wide">
              Accounts
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-2">
          <ScrollArea className="h-[350px]">
            <div className="flex flex-col space-y-2 py-2">
              {children}
              {accountsLength > 0 && <div className="h-1 border-t" />}
              <CreateAccountButton />
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccountsLinksAccordion;
