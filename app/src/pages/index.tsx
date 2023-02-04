import { type NextPage } from "next";
import Head from "next/head";
import Chart from "../components/Chart";
import Form from "../components/Form";
import Login from "../components/Login";
import { useId } from "../contexts/Id";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { id } = useId();
  const query = api.saves.get.useQuery(
    {
      id,
    },
    {
      enabled: Boolean(id),
    }
  );

  return (
    <>
      <Head>
        <title>Monthly Expenses</title>
        <meta
          name="description"
          content="App to visualize and track your monthly expenses"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-slate-700 p-4">
        {!id && (
          <div className="flex min-h-screen items-center justify-center">
            <Login />
          </div>
        )}

        {id && query.data && (
          <div className="flex gap-4">
            <Form
              id={id}
              latestEntries={
                JSON.parse(
                  query.data.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0]?.entries || "[]"
                ) || []
              }
            />

            <Chart saves={query.data} />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
