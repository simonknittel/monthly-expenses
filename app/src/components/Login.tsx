import { signIn } from "next-auth/react";
import Button from "./Button";

export default function Login() {
  return (
    <section className="flex w-full max-w-md flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50">
      <h2>Login</h2>

      <div className="text-sm text-slate-500">
        <p>
          Use any of the providers below. This app will use the login only for
          authentication. It won't be able to change any data on your account.
          It also won't be able to read your private GitHub repositories or
          similar.
        </p>

        <p className="mt-2">
          After authentication you will be asked to provied an encryption key.
          This key will be used to encrypt your monthly expenses on your machine
          before being sent to the server and stored in the database.
        </p>
      </div>

      <Button onClick={() => signIn("github")}>GitHub</Button>
    </section>
  );
}
