import type { GetServerSideProps } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import ChartContainer from "../components/ChartContainer";
import Form from "../components/Form";
import FormSkeleton from "../components/FormSkeleton";
import Logout from "../components/Logout";
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
  const router = useRouter();
  const { encryptionKey } = useEncryptionKey();
  const [saves, setSaves] = useState<
    | {
        date: Date;
        entries: Entry[];
      }[]
    | null
  >(null);

  const savesQuery = api.saves.get.useQuery(null, {
    enabled: Boolean(encryptionKey),
  });

  useEffect(() => {
    if (!encryptionKey) {
      router.push("/key");
      return;
    }

    if (!savesQuery.data) return;

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

      <main className="flex flex-col items-start gap-4">
        <Logout />

        <div className="grid w-full grid-rows-overview gap-4 lg:grid-cols-overview">
          {(!saves || !encryptionKey) && <FormSkeleton />}

          {saves && encryptionKey && (
            <Form
              encryptionKey={encryptionKey}
              latestEntries={
                saves.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
                  ?.entries || []
              }
            />
          )}

          <ChartContainer>
            {(!saves || !encryptionKey) && (
              <p className="text-slate-400">
                Loading and decrypting your data ...
              </p>
            )}

            {saves && saves.length <= 1 && encryptionKey && (
              <p className="text-slate-400">
                You need at least two data points for the visualization.
              </p>
            )}

            {saves && saves.length > 1 && encryptionKey && (
              <Chart saves={saves} />
            )}
          </ChartContainer>
        </div>
      </main>
    </>
  );
};

export default Page;