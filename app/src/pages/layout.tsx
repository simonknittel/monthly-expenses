import Head from "next/head";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-700 p-4">
        {children}

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
}
