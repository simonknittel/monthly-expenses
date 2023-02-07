import { useLogin } from "../contexts/Login";
import Button from "./Button";

export default function Logout() {
  const { logout } = useLogin();

  return (
    <Button onClick={logout} variant="secondary">
      &lt; Logout
    </Button>
  );
}
