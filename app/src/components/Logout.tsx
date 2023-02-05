import { useLogin } from "../contexts/Login";

export default function Logout() {
  const { logout } = useLogin();

  return (
    <button
      className="rounded p-4 text-xs uppercase text-slate-50 hover:bg-slate-600"
      onClick={logout}
    >
      &lt; Logout
    </button>
  );
}
