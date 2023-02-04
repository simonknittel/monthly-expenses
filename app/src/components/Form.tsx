import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

interface Entry {
  type: "revenue" | "expense";
  category: string;
  transactionPartner: string;
  description: string;
  value: number;
}

interface Props {
  data: {
    entries: Entry[];
    date: Date;
  };
}

interface FormValues {
  revenues: Entry[];
  expenses: Entry[];
  date: string;
}

export default function Form({ data }: Props) {
  console.log(data.date, data.date.toISOString().substring(0, 16));
  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      revenues: data.entries.filter(({ type }) => type === "revenue"),
      expenses: data.entries.filter(({ type }) => type === "expense"),
      date: data.date.toISOString().substring(0, 16),
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
    console.log(data);
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
