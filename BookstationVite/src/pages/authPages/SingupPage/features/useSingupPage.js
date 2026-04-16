import { signup } from "../../../../api/auth";
import { useAuthForm } from "../../../../hooks/useAuthForm";

export function useSingupPage() {
  return useAuthForm(
    signup,
    { name: "", email: "", password: "" },
    "/explore"
  );
}
