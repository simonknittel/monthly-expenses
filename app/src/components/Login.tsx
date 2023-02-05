import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useId } from "../contexts/Id";

interface FormValues {
  id: string;
  rememberMe: boolean;
}

export default function Login() {
  const { handleSubmit, register, setFocus } = useForm<FormValues>();
  const { login } = useId();

  useEffect(() => {
    setFocus("id");
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    login(data.id, data.rememberMe);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50"
    >
      <h2>Login</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="id" className="text-slate-400">
          ID
        </label>
        <input
          id="id"
          className="rounded bg-slate-700 p-2"
          type="text"
          {...register("id", { required: true })}
        />
      </div>

      <div className="flex gap-2">
        <input
          id="rememberMe"
          className="rounded bg-slate-700 p-2"
          type="checkbox"
          {...register("rememberMe")}
        />
        <label htmlFor="rememberMe" className="text-slate-400">
          Remember me
        </label>
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
