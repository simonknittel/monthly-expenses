import { useId } from "../contexts/Id";

export default function Logout() {
  const { logout } = useId();

  return (
    <button
      className="rounded p-4 text-xs uppercase text-slate-50 hover:bg-slate-600"
      onClick={logout}
    >
      &lt; Logout
    </button>
  );
}
