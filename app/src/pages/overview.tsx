import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import Form from "../components/Form";
import Logout from "../components/Logout";
import { useEncryptionKey } from "../contexts/EncryptionKey";
import { getServerAuthSession } from "../server/auth";
import { Entry } from "../types";
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
      router.push("/setup");
      return;
    }

    if (!savesQuery.data) return;

    const asyncWrapper = async () => {
      const saves = await Promise.all(
        savesQuery.data.map(async (save) => {
          return {
            date: save.date,
            entries: (await decrypt(save.entries, encryptionKey)).map(
              (entry) => ({
                ...entry,
                value: parseFloat(entry.value),
              })
            ),
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

        <div className="w-full overflow-x-auto">
          <div className="flex w-full gap-4">
            {!saves ||
              (!encryptionKey && (
                <div className="flex w-[480px] shrink-0 flex-col gap-4 rounded bg-slate-800 p-8">
                  <p className="text-slate-400">
                    Loading and decrypting your data ...
                  </p>
                </div>
              ))}

            {saves && encryptionKey && (
              <Form
                encryptionKey={encryptionKey}
                latestEntries={
                  saves.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
                    ?.entries || []
                }
              />
            )}

            {!saves ||
              (!encryptionKey && (
                <section className="min-w-[480px] grow rounded bg-slate-800 p-8">
                  <p className="text-slate-400">
                    Loading and decrypting your data ...
                  </p>
                </section>
              ))}

            {saves && saves.length <= 1 && encryptionKey && (
              <section className="min-w-[480px] grow rounded bg-slate-800 p-8">
                <p className="text-slate-400">
                  You need at least two data points for the visualization.
                </p>
              </section>
            )}

            {saves && saves.length > 1 && <Chart saves={saves} />}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
