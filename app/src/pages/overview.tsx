import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "../components/Button";
import Chart from "../components/Chart";
import Form from "../components/Form";
import Logout from "../components/Logout";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import { getServerAuthSession } from "../server/auth";
import type { Entry } from "../types";
import { api } from "../utils/api";
import { decrypt } from "../utils/encryption";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Page: NextPage = () => {
  const { encryptionKey } = useEncryptionKey();
  const [saves, setSaves] = useState<
    | {
        id: string;
        date: Date;
        entries: Entry[];
      }[]
    | null
  >(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const savesQuery = api.saves.getAll.useQuery(null, {
    enabled: Boolean(encryptionKey),
  });

  useEffect(() => {
    if (!encryptionKey || !savesQuery.data) return;

    const asyncWrapper = async () => {
      const saves = await Promise.all(
        savesQuery.data.map(async (save) => {
          const decryptedEntries = await decrypt<Entry[]>(
            save.entries,
            encryptionKey
          );
          const entries = decryptedEntries.map((decryptedEntry) => {
            return {
              ...decryptedEntry,
              value: parseFloat(decryptedEntry.value),
            };
          });

          return {
            id: save.id,
            date: save.date,
            entries,
          };
        })
      );

      setSaves(saves);
    };

    asyncWrapper();
  }, [savesQuery.data, encryptionKey]);

  return (
    <>
      <Head>
        <title>Overview - Monthly Expenses</title>
        <meta name="description" content="" />
      </Head>

      <main className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Logout />
          <Button onClick={() => setShowNewModal(true)}>
            Add new entry <FaPlus />
          </Button>
        </div>

        <section className="h-[480px] rounded bg-slate-800 p-8 text-slate-50">
          {(!saves || !encryptionKey) && (
            <p className="text-slate-400">
              Loading and decrypting your data ...
            </p>
          )}

          {saves && saves.length <= 1 && encryptionKey && (
            <p className="text-center font-bold text-slate-400">
              You need at least two data points for the visualization.
            </p>
          )}

          {saves && saves.length > 1 && encryptionKey && (
            <Chart saves={saves} />
          )}
        </section>

        <section className="overflow-x-auto rounded bg-slate-800 p-8 text-slate-50">
          {(!saves || !encryptionKey) && (
            <p className="text-slate-400">
              Loading and decrypting your data ...
            </p>
          )}

          {saves && encryptionKey && <Table saves={saves} />}
        </section>
      </main>

      <Modal
        isOpen={showNewModal}
        onRequestClose={() => setShowNewModal(false)}
        className="w-[480px]"
      >
        <h2 className="font-bold">Add new entry</h2>

        <p className="mb-4 text-slate-400">
          The form is prefilled with the data of your last entry.
        </p>

        <Form
          saveId={
            saves?.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.id
          }
          onCreated={() => setShowNewModal(false)}
        />
      </Modal>
    </>
  );
};

export default Page;
