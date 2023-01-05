import type { GetServerSideProps, NextPage } from "next";

import toast from "react-hot-toast";
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { MdArrowRightAlt } from "react-icons/md";

import type { ExtendedEvent, ExtendedInvitation } from "@/types/Event";
import toastStyle from "@/resources/toast.config";
import prisma from "@/lib/prisma";
import { participate } from "@/lib/fetchers";
import { AppLayout } from "@/components/Layout";
import { HeroSection } from "@/components/Event/Hero/Section";
import { MapSection } from "@/components/Event/Map/Section";
import { ParticipantSection } from "@/components/Event/Participant/Section";
import { CommentSection } from "@/components/Event/Comment/Section";
import { Header } from "@/components/UI/Header";
import { ExtendedSession } from "@/types/Session";
import { isAdmin } from "@/lib/role";
import { log } from "@/lib/log";
import { InvitationProvider } from "@/components/Invitation/Provider";

type Props = {
	event: ExtendedEvent;
	exists: boolean;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.params as { id: string };
	const session = (await getSession(context)) as ExtendedSession;
	const { user } = session || {};

	const event = await prisma.event.findFirst({
		where: {
			id,
			...(isAdmin(user)
				? { OR: [{ deletedAt: null }, { deletedAt: { not: null } }] }
				: {}),
		},
		include: {
			creator: true,
			participants: true,
			comments: {
				where: { parentId: null },
				include: { author: true, children: { include: { author: true } } },
			},
			invitations: {
				include: { receiver: true },
			},
		},
	});

	return {
		props: {
			exists: !!event,
			event,
		},
	};
};

const EventPage: NextPage<Props> = (props) => {
	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};
	const {
		creator,
		participants: initialParticipants,
		title,
		audience,
		audienceCampus,
		id,
		location,
		date,
		comments: initialComments,
		deletedAt,
		private: isPrivate,
		invitations: initialInvitations,
	} = props.event;
	const [participants, setParticipants] = useState(initialParticipants);
	const [invitations, setInvitations] = useState(initialInvitations);
	const isParticipant = participants.some((p) => p.email === user?.email);
	const isCreator = creator.email === user?.email;

	const handleParticipate = async () => {
		let toastId: string | undefined;
		try {
			toastId = toast.loading(
				isParticipant ? "Désinscription en cours..." : "Inscription en cours",
				toastStyle,
			);
			participate(id).then((result) => {
				if (result) {
					toast.success(
						isParticipant
							? "Participation retirée 😔"
							: "Participation réussie 😍",
						{ id: toastId },
					);
					setParticipants(result.participants);
					setInvitations(result.invitations as ExtendedInvitation[]);
				} else
					toast.error("Erreur lors de la participation 😭", {
						id: toastId,
					});
			});
		} catch (e) {
			log.error(e);
			toast.error("Unable to submit", { id: toastId });
		}
	};

	return (
		<AppLayout>
			<NextSeo title={title} />
			{deletedAt && user ? (
				<div className="inline-flex items-center justify-center w-full h-8 text-xs text-white gap-x-2 bg-red">
					{"L'élément a été désactivé par un administrateur"}
					{isAdmin(user) ? (
						<Link
							className="inline-flex items-center font-bold underline gap-x-1"
							href={`/admin/event?id=${id}`}
						>
							Restaurer
							<MdArrowRightAlt />
						</Link>
					) : null}
				</div>
			) : null}
			<section className="flex flex-col items-start w-full h-full px-4 pt-6 mx-auto md:px-12 lg:px-0 lg:max-w-5xl xl:max-w-6xl gap-y-4">
				<HeroSection
					id={id}
					title={title}
					date={date}
					location={location}
					campus={audienceCampus}
					audience={audience}
					creator={creator}
					isParticipant={isParticipant}
					isOwner={isCreator}
					private={isPrivate}
					participate={handleParticipate}
				/>
				<div className="grid w-full grid-cols-3 gap-4 pb-4 ">
					<div className="w-full col-span-3 lg:col-span-2">
						<MapSection location={location} />
					</div>
					<div className="w-full col-span-3 lg:col-span-1">
						<InvitationProvider setInvitations={setInvitations}>
							<ParticipantSection
								eventId={id}
								participants={participants}
								invitations={invitations}
								isCreator={isCreator}
							/>
						</InvitationProvider>
					</div>
					<div className="w-full col-span-3">
						<CommentSection initialComments={initialComments} eventId={id} />
					</div>
				</div>
			</section>
		</AppLayout>
	);
};

const EventNotFoundPage: NextPage<Props> = () => {
	return (
		<AppLayout>
			<NextSeo title="Événement introuvable" />
			<section className="flex flex-col items-start w-full h-full px-4 pt-6 mx-auto md:px-12 lg:px-0 lg:max-w-5xl xl:max-w-6xl gap-y-4">
				<Header text="Événement introuvable" />
				<div className="">
					<p className="text-lg">Petit malin 🤭</p>
					<p className="text-sm">{"Comment tu es arrivé là toi ? 🤔"}</p>

					<Link
						href="/event"
						className="inline-flex items-center gap-1 mt-4 text-sm font-bold underline"
					>
						Ok ok, je retourne dans le droit chemin
						<MdArrowRightAlt className="w-4 h-4" />
					</Link>
				</div>
			</section>
		</AppLayout>
	);
};

const EventPageWrapper: NextPage<Props> = (props) => {
	return props.exists ? (
		<EventPage {...props} />
	) : (
		<EventNotFoundPage {...props} />
	);
};

export default EventPageWrapper;
