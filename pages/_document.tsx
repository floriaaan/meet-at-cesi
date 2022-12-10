import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        {process.env.NEXT_PUBLIC_APP_ENV === "production" ||
        process.env.NEXT_PUBLIC_APP_ENV === undefined ? (
          <link rel="icon" href="/favicon.png" />
        ) : null}

        {process.env.NEXT_PUBLIC_APP_ENV === "development" ? (
          <link rel="icon" href="/favicon-dev.png" />
        ) : null}
        {process.env.NEXT_PUBLIC_APP_ENV === "local" ? (
          <link rel="icon" href="/favicon-local.png" />
        ) : null}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
