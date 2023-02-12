import { useEffect, useRef, useState } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { Entry } from "../types";
import { api } from "../utils/api";
import { encrypt } from "../utils/encryption";
import Button from "./Button";

interface Props {
  encryptionKey: string;
  latestEntries: Entry[];
}

interface FormValues {
  date: string;
  revenues: Entry[];
  expenses: Entry[];
}

export default function Form({ encryptionKey, latestEntries }: Props) {
  const utils = api.useContext();
  const mutation = api.saves.store.useMutation({});

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentDateAndTime, setCurrentDateAndTime] = useState(true);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  const { control, handleSubmit, register, setValue } = useForm<FormValues>({
    defaultValues: {
      revenues: latestEntries.filter(({ type }) => type === "revenue"),
      expenses: latestEntries.filter(({ type }) => type === "expense"),
      date: now.toISOString().substring(0, 16),
    },
  });

  const {
    fields: revenues,
    remove: removeRevenue,
    append: appendRevenue,
  } = useFieldArray({
    control,
    name: "revenues",
  });

  const {
    fields: expenses,
    remove: removeExpense,
    append: appendExpense,
  } = useFieldArray({
    control,
    name: "expenses",
  });

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);

    if (!currentDateAndTime) return;

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setValue("date", now.toISOString().substring(0, 16));

    interval.current = setInterval(() => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setValue("date", now.toISOString().substring(0, 16));
    }, 1000);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [currentDateAndTime, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const encryptedDataString = await encrypt(
      [...data.revenues, ...data.expenses],
      encryptionKey
    );

    await mutation.mutateAsync({
      date: new Date(data.date),
      entries: encryptedDataString,
    });

    toast.success("Saved new entry");

    await utils.saves.get.invalidate();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[480px] shrink-0 flex-col gap-4 rounded bg-slate-800 p-8 text-slate-50"
    >
      <div className="flex flex-col gap-1">
        <p className="text-green-300">Revenues</p>

        {revenues.length > 0 && (
          <div className="flex gap-1">
            <p className="flex shrink grow basis-40 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Transaction partner
            </p>

            <p className="flex shrink grow basis-40 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Description
            </p>

            <p className="flex shrink grow basis-20 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Value
            </p>

            <div className="basis-10"></div>
          </div>
        )}

        {revenues.map((item, index) => (
          <div className="flex gap-1" key={item.id}>
            <div className="flex shrink grow basis-40 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2"
                type="text"
                {...register(`revenues.${index}.transactionPartner`, {
                  required: true,
                })}
              />
            </div>

            <div className="flex shrink grow basis-40 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2"
                type="text"
                {...register(`revenues.${index}.description`)}
              />
            </div>

            <div className="flex shrink grow basis-20 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2 text-right"
                type="number"
                step={0.01}
                {...register(`revenues.${index}.value`, { min: 0 })}
              />
            </div>

            <button
              className="basis-10 rounded border border-slate-700 p-2 text-xs uppercase hover:bg-slate-700"
              type="button"
              onClick={() => removeRevenue(index)}
              title="Remove entry"
            >
              x
            </button>
          </div>
        ))}

        <button
          className="rounded p-2 text-xs uppercase hover:bg-slate-700"
          onClick={() =>
            appendRevenue({
              type: "revenue",
              category: "",
              transactionPartner: "",
              description: "",
              value: 0,
            })
          }
        >
          Add new entry +
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-red-300">Expenses</p>

        {expenses.length > 0 && (
          <div className="flex gap-1">
            <p className="flex shrink grow basis-40 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Transaction partner
            </p>

            <p className="flex shrink grow basis-40 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Description
            </p>

            <p className="flex shrink grow basis-20 flex-col gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400">
              Value
            </p>

            <div className="basis-10"></div>
          </div>
        )}

        {expenses.map((item, index) => (
          <div className="flex gap-1" key={item.id}>
            <div className="flex shrink grow basis-40 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2"
                type="text"
                {...register(`expenses.${index}.transactionPartner`, {
                  required: true,
                })}
              />
            </div>

            <div className="flex shrink grow basis-40 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2"
                type="text"
                {...register(`expenses.${index}.description`)}
              />
            </div>

            <div className="flex shrink grow basis-20 flex-col gap-1">
              <input
                className="w-full grow rounded bg-slate-700 p-2 text-right"
                type="number"
                step={0.01}
                {...register(`expenses.${index}.value`, { min: 0 })}
              />
            </div>

            <button
              className="basis-10 rounded border border-slate-700 p-2 text-xs uppercase hover:bg-slate-700"
              type="button"
              onClick={() => removeExpense(index)}
              title="Remove entry"
            >
              x
            </button>
          </div>
        ))}

        <button
          className="rounded p-2 text-xs uppercase hover:bg-slate-700"
          onClick={() =>
            appendExpense({
              type: "expense",
              category: "",
              transactionPartner: "",
              description: "",
              value: 0,
            })
          }
        >
          Add new entry +
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-slate-400">
            Datum
          </label>

          <input
            id="date"
            className="rounded bg-slate-700 p-2"
            type="datetime-local"
            disabled={currentDateAndTime}
            {...register("date", { required: true })}
          />
        </div>

        <div className="flex">
          <div className="flex w-5 items-center">
            <input
              id="rememberMe"
              className="rounded bg-slate-700 p-2"
              type="checkbox"
              checked={currentDateAndTime}
              onChange={() => setCurrentDateAndTime(!currentDateAndTime)}
            />
          </div>

          <label htmlFor="rememberMe" className="text-slate-400">
            Current date and time
          </label>
        </div>
      </div>

      <div className="flex flex-row-reverse gap-2">
        <Button type="submit">Save</Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </form>
  );
}
