import { AppLayout } from "@/components/Layout";
import { NextPage } from "next";
import Link from "next/link";

const LegalPage: NextPage = () => {
	return (
		<AppLayout>
			<article className="max-w-xl mx-auto mt-8 prose text-justify dark:prose-invert">
				<h1>{"Conditions d'utilisation"}</h1>
				<figcaption>
					Dernière mise à jour : 09/01/2023 par FLORIAN LEROUX
				</figcaption>
				<hr />
				<p>
					<Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link> est une
					plateforme en ligne conçue pour aider les étudiants à planifier et
					organiser leurs rendez-vous de manière simple et efficace. Nous
					mettons à disposition un outil de communication et de planification,
					mais nous ne sommes pas responsables des événements qui sont organisés
					à travers notre plateforme ni de leur déroulement.
				</p>
				<p>
					En utilisant <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>,
					vous reconnaissez et acceptez que vous êtes seul responsable de tous
					les événements que vous organisez et de toutes les conséquences de
					leur organisation et de leur déroulement. Vous acceptez également de
					dégager de toute responsabilité{" "}
					<Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link> et ses
					administrateurs, employés, agents et représentants pour tous les
					dommages, pertes, responsabilités, coûts et dépenses de quelque nature
					que ce soit que vous pourriez encourir en relation avec l{"'"}
					utilisation de notre plateforme ou avec l{"'"}organisation ou le
					déroulement de tout événement organisé à travers notre plateforme.
				</p>
				<p>
					Il est de votre responsabilité de respecter toutes les lois et
					réglementations en vigueur lors de l{"'"}organisation et du
					déroulement de vos événements, y compris les lois et réglementations
					relatives à l{"'"}alcool et aux drogues. Nous vous encourageons à
					utiliser <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link> de
					manière responsable et à prendre les précautions nécessaires pour
					assurer la sécurité de vos événements. Nous ne sommes pas responsables
					des actions ou des omissions de toute personne participant à un
					événement organisé à travers notre plateforme.
				</p>
				<p>
					En utilisant <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>,
					vous acceptez de dégager de toute responsabilité{" "}
					<Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link> et ses
					administrateurs et représentants pour tous les dommages, pertes,
					responsabilités, coûts et dépenses de quelque nature que ce soit que
					vous pourriez encourir en raison des actions ou omissions de toute
					personne participant à un événement organisé à travers notre
					plateforme.
				</p>
				<p>
					En utilisant <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>,
					vous reconnaissez que vous êtes seul responsable de vos propres
					actions et décisions et que vous utilisez notre plateforme à vos
					propres risques. Nous ne pouvons pas garantir que notre plateforme
					sera exempte d{"'"}erreurs ou de défauts, ni que son utilisation sera
					ininterrompue ou exempte de virus ou de tout autre élément nuisible.
					Nous déclinons toute responsabilité en cas de dommages causés par l
					{"'"}utilisation de notre application.
				</p>
			</article>
		</AppLayout>
	);
};

export default LegalPage;
