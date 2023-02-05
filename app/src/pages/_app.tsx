import { type AppType } from "next/app";
import { api } from "../utils/api";
import "../styles/globals.css";
import { LoginProvider } from "../contexts/Login";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <LoginProvider>
        <Component {...pageProps} />
        <Toaster />
      </LoginProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
