import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { IdProvider } from "../contexts/Id";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <Component {...pageProps} />
      <Toaster />
    </IdProvider>
  );
};

export default api.withTRPC(MyApp);
