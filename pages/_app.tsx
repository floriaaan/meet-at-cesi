import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { PreferencesPopup } from "@/components/Helpers/PreferencesPopup";

const App = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps as { session: Session | null | undefined };
  return (
    <SessionProvider session={session}>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
      <Toaster />
      <Analytics />
    </SessionProvider>
  );
};

export default App;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  return (
    <>
      {children}
      {status === "authenticated" && <PreferencesPopup />}
    </>
  );
};
