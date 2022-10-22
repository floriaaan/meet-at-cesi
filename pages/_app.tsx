import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider
      session={(pageProps as { session: Session | null | undefined }).session}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
