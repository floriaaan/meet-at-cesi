import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from "next-seo";

import "@/styles/globals.css";
import { PreferencesPopup } from "@/components/Helpers/PreferencesPopup";

const App = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps as { session: Session | null | undefined };
  return (
    <SessionProvider session={session}>
      <DefaultSeo
        defaultTitle={process.env.NEXT_PUBLIC_APP_NAME}
        titleTemplate={`%s | ${process.env.NEXT_PUBLIC_APP_NAME}`}
        description={`${process.env.NEXT_PUBLIC_APP_NAME} est une application web qui permet de créer des événements et de les partager avec ses amis.`}
        openGraph={{
          type: "website",
          locale: "fr_FR",
          site_name: process.env.NEXT_PUBLIC_APP_NAME,
        }}
        twitter={{
          handle: "@floriaaan",
          cardType: "summary_large_image",
        }}
      />
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
