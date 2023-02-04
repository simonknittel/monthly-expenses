import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useId } from "../contexts/Id";

interface FormValues {
  id: string;
}

export default function Login() {
  const { handleSubmit, register, setFocus } = useForm<FormValues>();
  const { setId } = useId();

  useEffect(() => {
    setFocus("id");
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setId(data.id);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-md flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50"
    >
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
