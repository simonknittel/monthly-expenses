import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import Button from "./Button";

interface FormValues {
  encryptionKey: string;
  rememberMe: boolean;
}

export default function EncryptionKey() {
  const { handleSubmit, register, setFocus } = useForm<FormValues>();
  const { set } = useEncryptionKey();

  useEffect(() => {
    setFocus("encryptionKey");
  }, [setFocus]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    set(data.encryptionKey, data.rememberMe);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50"
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <label htmlFor="encryptionKey" className="text-slate-400">
            Encryption key
          </label>
          <p className="text-sm text-slate-500">
            All data except for dates will be encrypted with your encryption key
            in your browser before being sent to the server and stored in the
            database.
          </p>
          <input
            id="encryptionKey"
            className="rounded bg-slate-700 p-2"
            type="password"
            autoComplete="current-password"
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
            Remember
          </label>
        </div>

        <p className="ml-5 text-sm text-slate-500">
          Stores the encryption key in your browser&apos;s LocalStorage. This
          way you won&apos;t have to enter you key everytime you visit this app.
        </p>
      </div>

      <div className="flex flex-row-reverse gap-2">
        <Button type="submit">Set</Button>
      </div>
    </form>
  );
}
