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
          content="Track and visualize monthly expenses"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-700 p-4">
        {!username && (
          <div className="flex flex-col items-center justify-center gap-4">
            <header className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-slate-50">
                Monthly Expenses
              </h1>

              <p className="text-slate-400">
                Track and visualize monthly expenses
              </p>
            </header>

            <Login />
          </div>
        )}

        {username && encryptionKey && (
          <main className="flex flex-col items-start gap-4">
            <Logout />

            <div className="w-full overflow-x-scroll">
              <div className="flex w-full gap-4">
                {!saves && (
                  <div className="flex w-[480px] shrink-0 flex-col gap-4 rounded bg-slate-800 p-8">
                    <p className="text-slate-400">
                      Loading and decrypting your data ...
                    </p>
                  </div>
                )}

                {saves && (
                  <Form
                    username={username}
                    encryptionKey={encryptionKey}
                    latestEntries={
                      saves.sort(
                        (a, b) => b.date.getTime() - a.date.getTime()
                      )[0]?.entries || []
                    }
                  />
                )}

                {!saves && (
                  <section className="min-w-[480px] grow rounded bg-slate-800 p-8">
                    <p className="text-slate-400">
                      Loading and decrypting your data ...
                    </p>
                  </section>
                )}

                {saves && saves.length <= 1 && (
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
        )}

        <footer className="flex w-full justify-center gap-2 p-4 text-slate-500">
          <p>Monthly Expenses</p>

          <span>&bull;</span>

          <a
            href="https://github.com/simonknittel/monthly-expenses"
            className="text-slate-400 underline underline-offset-4 hover:text-slate-300"
          >
            GitHub
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;
