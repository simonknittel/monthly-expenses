import type { Save } from "@prisma/client";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTable } from "react-table";
import type { Entry } from "../types";
import { api } from "../utils/api";
import Button from "./Button";
import Form from "./Form";
import Modal from "./Modal";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

interface Props {
  saves: { id: string; date: Date; entries: Entry[] }[];
}

export default function Table({ saves }: Props) {
  const utils = api.useContext();
  const deleteMutation = api.saves.delete.useMutation();
  const [modalSaveId, setModalSaveId] = useState<Save["id"] | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const editHandler = (id: Save["id"]) => {
    setModalSaveId(id);
    setModalIsOpen(true);
  };

  const deleteHandler = async (id: Save["id"]) => {
    await deleteMutation.mutateAsync({ id });
    toast.success("Entry deleted");
    await utils.saves.getAll.invalidate();
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }: { value: Date }) => {
          const timeFormat = new Intl.DateTimeFormat("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
          });

          return (
            <span className="text-slate-400">{timeFormat.format(value)}</span>
          );
        },
      },
      {
        Header: () => <span className="text-green-300">Revenues</span>,
        accessor: "revenues",
        Cell: ({ value }: { value: number }) => value.toFixed(2),
      },
      {
        Header: () => <span className="text-red-300">Expenses</span>,
        accessor: "expenses",
        Cell: ({ value }: { value: number }) => value.toFixed(2),
      },
      {
        id: "controls",
        Cell: ({
          row,
        }: {
          row: {
            original: {
              id: string;
              date: Date;
              revenues: number;
              expenses: number;
            };
          };
        }) => {
          const timeFormat = new Intl.DateTimeFormat("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
          });

          return (
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => editHandler(row.original.id)}
                variant="secondary"
                title="Edit"
                aria-label={`Edit the entry from ${timeFormat.format(
                  row.original.date
                )}`}
                iconOnly={true}
              >
                <FaRegEdit />
              </Button>

              <Button
                onClick={() => deleteHandler(row.original.id)}
                variant="secondary"
                title="Delete"
                aria-label={`Delete the entry from ${timeFormat.format(
                  row.original.date
                )}`}
                iconOnly={true}
              >
                <FaRegTrashAlt />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const data = useMemo(() => {
    return saves
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((save) => {
        let revenues = 0;
        let expenses = 0;

        save.entries.forEach((entry) => {
          if (entry.type === "revenue") revenues += entry.value;
          if (entry.type === "expense") expenses += entry.value;
        });

        return {
          id: save.id,
          date: save.date,
          revenues,
          expenses,
        };
      });
  }, [saves]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <>
      <table {...getTableProps()} className="w-full text-right">
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="grid grid-cols-[1fr_1fr_1fr_8rem] items-center gap-4"
            >
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps()}
                  className={clsx({
                    "font-normal": true,
                  })}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr
                {...row.getRowProps()}
                className="grid grid-cols-[1fr_1fr_1fr_8rem] items-center gap-4"
              >
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <td
                    {...cell.getCellProps()}
                    className={clsx({
                      "font-normal": true,
                    })}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {saves.length === 0 && (
        <p className="mt-6 text-center font-bold text-slate-400">
          You don&apos;t have any saved entries yet.
        </p>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="w-[480px]"
      >
        <h2 className="mb-4 font-bold">Edit entry</h2>

        <Form
          saveId={modalSaveId}
          editingExisting={true}
          onUpdated={() => setModalIsOpen(false)}
        />
      </Modal>
    </>
  );
}
