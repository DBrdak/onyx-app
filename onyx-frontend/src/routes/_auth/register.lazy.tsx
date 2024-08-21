import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/register")({
  component: () => <div>Hello /_home-layout/_auth/register!</div>,
});
