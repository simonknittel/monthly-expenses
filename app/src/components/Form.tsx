import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { api } from "../utils/api";

interface Entry {
  type: "revenue" | "expense";
  category: string;
  transactionPartner: string;
  description: string;
  value: number;
}

interface Props {
  id: string;
  latestEntries: Entry[];
}

interface FormValues {
  date: string;
  revenues: Entry[];
  expenses: Entry[];
}

export default function Form({ id, latestEntries }: Props) {
  const mutation = api.saves.store.useMutation({});

  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      revenues: latestEntries.filter(({ type }) => type === "revenue"),
      expenses: latestEntries.filter(({ type }) => type === "expense"),
      date: new Date().toISOString().substring(0, 16),
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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate({
      id,
      date: new Date(data.date),
      entries: JSON.stringify([...data.revenues, ...data.expenses]),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-xl flex-col gap-4 rounded bg-slate-800 p-8  text-slate-50"
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
          Add new +
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
          Add new +
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-slate-400">
          Datum
        </label>
        <input
          id="date"
          className="rounded bg-slate-700 p-2"
          type="datetime-local"
          {...register("date", { required: true })}
        />
      </div>

      <div className="flex flex-row-reverse gap-2">
        <button
          type="submit"
          className="basis-32 rounded bg-slate-900 p-4 uppercase hover:bg-slate-700"
        >
          Save
        </button>
        <button
          type="reset"
          className="basis-32 rounded p-2 text-xs uppercase hover:bg-slate-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
