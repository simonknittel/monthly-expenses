import { type AppType } from "next/app";
import { api } from "../utils/api";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./layout";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { EncryptionKeyProvider } from "../contexts/EncryptionKey";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  if (session) {
    return (
      <>
        <SessionProvider session={session}>
          <EncryptionKeyProvider>
            <Layout>
              <Component {...pageProps} />
              <Toaster />
              <Analytics />
            </Layout>
          </EncryptionKeyProvider>
        </SessionProvider>
      </>
    );
  }

  return (
    <>
      <SessionProvider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
          <Analytics />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
