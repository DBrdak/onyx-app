import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

export type AccordionTitle = {
  label: string;
  Icon: LucideIcon;
};

export type SidebarLink = {
  label: string;
  to: string;
  params?: Record<string, string>;
  preload?: false | "intent";
};

export type AccordionData = {
  title: AccordionTitle;
  links: SidebarLink[];
  additionalContent?: ReactNode;
};
