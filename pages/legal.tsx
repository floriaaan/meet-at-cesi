import Link from "next/link";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";

import { AppLayout } from "@/components/Layout";

export const CGU_LAST_UPDATE = { date: "09/01/2023", by: "FLORIAN LEROUX" };

const LegalPage: NextPage = () => {
	const { back, push } = useRouter();
	const goBack = () => {
		if (window.history.length > 2) back();
		else push("/");
	};

	return (
		<AppLayout>
			<NextSeo title="Conditions générales d'utilisation" />
			<article className="max-w-2xl px-4 mx-auto my-12 prose text-justify dark:prose-invert">
				<button
					className="inline-flex items-center underline gap-x-1 dark:text-neutral-300 dark:hover:text-white"
					onClick={goBack}
				>
					<MdArrowBack />
					Retour
				</button>
				<h1 className="text-left">{"Conditions générales d'utilisation"}</h1>
				<figcaption>
					Dernière mise à jour : {CGU_LAST_UPDATE.date} par {CGU_LAST_UPDATE.by}
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
				<p>
					En utilisant <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>,
					vous acceptez que nous ne sommes pas responsables des contenus publiés
					sur notre plateforme par les utilisateurs. Nous ne sommes pas tenus de
					surveiller les contenus publiés par les utilisateurs et nous n{"'"}
					assumons aucune responsabilité à leur égard. Si vous constatez que des
					contenus publiés par des utilisateurs sont inappropriés ou enfreignent
					les termes d{"'"}utilisation de notre plateforme, nous vous
					encourageons à nous en informer immédiatement afin que nous puissions
					prendre les mesures nécessaires.
				</p>
				<p>
					<Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link> se réserve le
					droit de modifier, suspendre ou retirer tout contenu publié sur notre
					plateforme à tout moment et sans préavis. Nous nous réservons
					également le droit de refuser l{"'"}accès à notre plateforme à tout
					utilisateur en cas de violation de nos termes d{"'"}utilisation ou de
					toute loi ou réglementation en vigueur.
				</p>
				<p>
					En utilisant <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>,
					vous acceptez de ne pas utiliser notre plateforme à des fins illégales
					ou interdites par les présentes conditions d{"'"}utilisation. Vous
					vous engagez également à ne pas perturber ou enfreindre les droits de
					tout tiers ou de faire quoi que ce soit qui pourrait endommager notre
					plateforme ou en compromettre le bon fonctionnement.{" "}
				</p>
				<p>
					Le présent disclaimer constitue l{"'"}intégralité de l{"'"}accord
					entre vous et <Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>{" "}
					en ce qui concerne l{"'"}utilisation de notre plateforme. Si une
					disposition de ce disclaimer est jugée invalide ou inapplicable, elle
					sera réputée séparable et n{"'"}affectera pas la validité et l{"'"}
					applicabilité des dispositions restantes. Nous vous encourageons à
					lire attentivement le présent disclaimer et à le consulter
					régulièrement afin de prendre connaissance de toute modification
					éventuelle.{" "}
				</p>
				<p>
					En continuant à utiliser{" "}
					<Link href="/">{process.env.NEXT_PUBLIC_APP_NAME}</Link>, vous
					acceptez de vous conformer au présent disclaimer tel que modifié de
					temps à autre.
				</p>
			</article>
		</AppLayout>
	);
};

export default LegalPage;
