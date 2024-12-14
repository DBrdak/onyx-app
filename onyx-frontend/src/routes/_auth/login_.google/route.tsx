import { GoogleAuthSchema } from "@/lib/validation/searchParams";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login/google")({
  validateSearch: GoogleAuthSchema,
});
