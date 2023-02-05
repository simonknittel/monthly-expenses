import { type NextPage } from "next";
import Head from "next/head";
import Chart from "../components/Chart";
import Form from "../components/Form";
import Login from "../components/Login";
import Logout from "../components/Logout";
import { useLogin } from "../contexts/Login";

const Home: NextPage = () => {
  const { username, encryptionKey, saves } = useLogin();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Monthly Expenses</title>
        <meta
          name="description"
          content="App to visualize and track your monthly expenses"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-slate-700 p-4">
        {!username && (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-slate-50">
              Monthly Expenses
            </h1>
            <Login />
          </div>
        )}

        {username && encryptionKey && saves && (
          <div className="flex flex-col items-start gap-4">
            <Logout />

            <div className="w-full overflow-x-scroll">
              <div className="flex w-full gap-4">
                <Form
                  username={username}
                  encryptionKey={encryptionKey}
                  latestEntries={saves[0]?.entries || []}
                />

                <Chart saves={saves} />
              </div>
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
