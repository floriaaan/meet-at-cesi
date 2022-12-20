import { Analytics } from "@vercel/analytics/react";
import { SessionProvider, useSession } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { FeedbackWrapper } from "@/components/Helpers/Feedback";
import { PreferencesPopup } from "@/components/Helpers/Popup/Preferences";
import { ReportProvider } from "@/components/Report/Wrapper";
import "@/styles/globals.css";
import "@/styles/nprogress.css";
import { ExtendedSession } from "@/types/Session";

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
			<Head>
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
			</Head>
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

	if (status !== "authenticated") return <>{children}</>;

	return (
		<>
			<ReportProvider>{children}</ReportProvider>
			<PreferencesPopup />
			<FeedbackWrapper />
		</>
	);
};
