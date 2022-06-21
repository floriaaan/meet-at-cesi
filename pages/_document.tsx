import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta name="application-name" content="meet at CESI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="meet at CESI" />
        <meta name="description" content="meet at CESI" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="apple-touch-icon" href="/static/icon-512x512.png" />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/static/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/static/icon-512x512.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/static/icon-512x512.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/static/icon-192x192.png"
        />

        <link rel="manifest" href="/manifest.json" />

        <link rel="shortcut icon" href="/static/icon-192x192.png" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="meet at CESI" />
        <meta
          name="twitter:description"
          content="Organiser des soirées et évenements avec meet at CESI"
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@t3tra_" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="meet at CESI" />
        <meta
          property="og:description"
          content="Organiser des soirées et évenements avec meet at CESI"
        />
        <meta property="og:site_name" content="meet at CESI" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/static/icon-512x512.png"
        />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />

        {/* <!-- apple splash screen images --> */}
        {/* <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
<link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
