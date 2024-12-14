import { createFileRoute } from "@tanstack/react-router";
import { LoginPageParamsSchema } from "@/lib/validation/searchParams";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: LoginPageParamsSchema,
});
