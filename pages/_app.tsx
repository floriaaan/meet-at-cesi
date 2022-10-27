import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider
      session={(pageProps as { session: Session | null | undefined }).session}
    >
      <Component {...pageProps} />
      <Toaster/>
    </SessionProvider>
  );
};

export default App;
