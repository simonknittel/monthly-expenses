import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import Login from "../components/Login";
import { getServerAuthSession } from "../server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/setup",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Monthly Expenses</title>
        <meta
          name="description"
          content="Track and visualize monthly expenses"
        />
      </Head>

      <div className="flex flex-col items-center justify-center gap-4">
        <header className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-slate-50">Monthly Expenses</h1>

          <p className="text-slate-400">Track and visualize monthly expenses</p>
        </header>

        <Login />
      </div>
    </>
  );
};

export default Home;
