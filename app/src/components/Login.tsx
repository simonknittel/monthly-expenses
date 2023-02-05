import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLogin } from "../contexts/Login";

interface FormValues {
  username: string;
  encryptionKey: string;
  rememberMe: boolean;
}

export default function Login() {
  const { handleSubmit, register, setFocus } = useForm<FormValues>();
  const { login } = useLogin();

  useEffect(() => {
    setFocus("username");
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    login(data.username, data.encryptionKey, data.rememberMe);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50"
    >
      <h2>Login</h2>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-slate-400">
            Username
            <p className="text-sm text-slate-500">
              Will be used to retrieve your data from the database. The username
              is case-insensitive.
            </p>
          </label>
          <input
            id="username"
            className="rounded bg-slate-700 p-2"
            type="text"
            {...register("username", { required: true })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <label htmlFor="encryptionKey" className="text-slate-400">
            Encryption key
            <p className="text-sm text-slate-500">
              Will be used to encrypt and decrypt the data. The key is
              case-sensitive.
            </p>
          </label>
          <input
            id="encryptionKey"
            className="rounded bg-slate-700 p-2"
            type="text"
            {...register("encryptionKey", { required: true })}
          />
        </div>
      </div>

      <div>
        <div className="flex">
          <div className="flex w-5 items-center">
            <input
              id="rememberMe"
              className="rounded bg-slate-700 p-2"
              type="checkbox"
              {...register("rememberMe")}
            />
          </div>

          <label htmlFor="rememberMe" className="text-slate-400">
            Remember me
          </label>
        </div>

        <p className="ml-5 text-sm text-slate-500">
          Stores the username and key in your browser&apos;s LocalStorage.
        </p>
      </div>

      <div className="flex flex-row-reverse gap-2">
        <button
          type="submit"
          className="basis-32 rounded bg-slate-900 p-4 uppercase hover:bg-slate-700"
        >
          Login
        </button>
      </div>
    </form>
  );
}
