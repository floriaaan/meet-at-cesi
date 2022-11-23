import { SessionProvider, useSession } from "next-auth/react";
import { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { DefaultSeo } from "next-seo";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import "@/styles/globals.css";
import { PreferencesPopup } from "@/components/Helpers/PreferencesPopup";
import { ExtendedSession } from "@/types/Session";
import { FeedbackWrapper } from "@/components/Helpers/Feedback";

const App = ({ Component, pageProps }: AppProps) => {
  const { session } = pageProps as {
    session: ExtendedSession | null | undefined;
  };
  const [url, setUrl] = useState<undefined | string>(undefined);
  const router = useRouter();

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes("localhost")) setUrl(hostname + router.pathname);
    else if (hostname.includes("dev"))
      setUrl(hostname.split(".")[0] + router.pathname);
  }, [router.pathname]);

  return (
    <SessionProvider session={session}>
      <DefaultSeo
        defaultTitle={process.env.NEXT_PUBLIC_APP_NAME}
        titleTemplate={url || `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`}
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
      {status === "authenticated" && (
        <>
          <PreferencesPopup />
          <FeedbackWrapper />
        </>
      )}
    </>
  );
};
