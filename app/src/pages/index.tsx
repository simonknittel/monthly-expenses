import { type NextPage } from "next";
import Head from "next/head";
import Chart from "../components/Chart";
import Form from "../components/Form";
import Login from "../components/Login";
import Logout from "../components/Logout";
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
          <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-slate-50">
              Monthly Expenses
            </h1>
            <Login />
          </div>
        )}

        {id && query.data && (
          <div className="flex flex-col items-start gap-4">
            <Logout />

            <div className="flex w-full gap-4">
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

            <div className="flex w-full justify-center p-4 text-slate-600">
              <p>Monthly Expenses</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
