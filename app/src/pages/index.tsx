import { type NextPage } from "next";
import Head from "next/head";
import Form from "../components/Form";

const data = {
  entries: [
    {
      type: "expense",
      category: "Wohnung",
      transactionPartner: "Stephan Langner",
      description: "Wohnung",
      value: 595,
    },
    {
      type: "expense",
      category: "Wohnung",
      transactionPartner: "Stephan Langner",
      description: "Betriebskosten",
      value: 85,
    },
    {
      type: "revenue",
      category: "Gehalt",
      transactionPartner: "hmmh multimediahaus AG",
      description: "Festanstellung",
      value: 2821,
    },
    {
      type: "revenue",
      category: "Spotify Family",
      transactionPartner: "Lennart Finger",
      description: "",
      value: 3,
    },
  ],
  date: new Date(),
};

const Home: NextPage = () => {
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
        <Form data={data} />
      </main>
    </>
  );
};

export default Home;
