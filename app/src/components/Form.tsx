import type { Save } from "@prisma/client";
import { useEffect } from "react";
import { type SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import useDateInput from "../hooks/useDateInput";
import type { Entry } from "../types";
import { api } from "../utils/api";
import { decrypt, encrypt } from "../utils/encryption";
import Button from "./Button";

interface Props {
  editingExisting?: boolean | null;
  saveId?: Save["id"] | null;
  onCreated?: () => void;
  onUpdated?: () => void;
}

export interface FormValues {
  date: string;
  revenues: Entry[];
  expenses: Entry[];
}

export default function Form({
  saveId,
  editingExisting,
  onCreated,
  onUpdated,
}: Props) {
  const { encryptionKey } = useEncryptionKey();
  const utils = api.useContext();
  const saveQuery = api.saves.get.useQuery(
    {
      id: saveId,
    },
    {
      enabled: Boolean(saveId),
    }
  );
  const createMutation = api.saves.create.useMutation();
  const updateMutation = api.saves.update.useMutation();

  const { control, handleSubmit, register, setValue } = useForm<FormValues>();

  useEffect(() => {
    if (!encryptionKey || !saveQuery.data) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

      setValue("date", now.toISOString().substring(0, 16));

      return;
    }

    const asyncWrapper = async () => {
      setValue("date", saveQuery.data.date.toISOString().substring(0, 16));

      const decryptedEntries = await decrypt<Entry[]>(
        saveQuery.data.entries,
        encryptionKey
      );
      const entries = decryptedEntries.map((decryptedEntry) => {
        return {
          ...decryptedEntry,
          value: parseFloat(decryptedEntry.value),
        };
      });

      setValue(
        "revenues",
        entries.filter(({ type }) => type === "revenue") || []
      );

      setValue(
        "expenses",
        entries.filter(({ type }) => type === "expense") || []
      );
    };

    asyncWrapper();
  }, [saveId, saveQuery.data, encryptionKey]);

  const { currentDateAndTime, setCurrentDateAndTime } = useDateInput(
    setValue,
    editingExisting
  );

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!encryptionKey) return;

    const encryptedDataString = await encrypt(
      [...data.revenues, ...data.expenses],
      encryptionKey
    );

    if (editingExisting && saveId) {
      await updateMutation.mutateAsync({
        id: saveId,
        date: new Date(data.date),
        entries: encryptedDataString,
      });

      toast.success("Entry updated");

      onUpdated?.();
    } else {
      await createMutation.mutateAsync({
        date: new Date(data.date),
        entries: encryptedDataString,
      });

      toast.success("New entry updated");

      onCreated?.();
    }

    await utils.saves.getAll.invalidate();
    await utils.saves.get.invalidate();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

            <Button
              onClick={() => removeRevenue(index)}
              title="Remove entry"
              variant="secondary"
              iconOnly={true}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        ))}

        <Button
          variant="tertiary"
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
        </Button>
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

            <Button
              onClick={() => removeExpense(index)}
              title="Remove entry"
              variant="secondary"
              iconOnly={true}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        ))}

        <Button
          variant="tertiary"
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
        </Button>
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
        {/* <Button type="reset" variant="secondary">
          Reset
        </Button> */}
      </div>
    </form>
  );
}
