import { login } from "../../../../api/auth";
import { useAuthForm } from "../../../../hooks/useAuthForm";

export function useLoginPage() {
  return useAuthForm(login, { email: "", password: "" }, "/explore");
}
