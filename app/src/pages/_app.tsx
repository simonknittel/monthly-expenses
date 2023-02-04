import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { IdProvider } from "../contexts/Id";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <Component {...pageProps} />
    </IdProvider>
  );
};

export default api.withTRPC(MyApp);
