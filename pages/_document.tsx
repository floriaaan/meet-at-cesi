import { useTheme } from "next-themes";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	const { theme } = useTheme();
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

				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />

				{process.env.NEXT_PUBLIC_APP_ENV === "production" ||
				process.env.NEXT_PUBLIC_APP_ENV === undefined ? (
					<link rel="manifest" href="/app/manifest.webmanifest" />
				) : (
					<link rel="manifest" href="/app/dev/manifest.webmanifest" />
				)}

				<link rel="apple-touch-icon" href="/app/icon-512x512.png"></link>
				
				<meta name="apple-mobile-web-app-capable" content="yes" />
				{theme === "dark" && (
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="black-translucent"
					/>
				)}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
