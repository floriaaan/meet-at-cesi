import { ReportObject, ReportType, User } from "@prisma/client";

import classNames from "classnames";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Header } from "@/components/UI/Header";
import { MdChevronLeft, MdEdit, MdWarning } from "react-icons/md";
import { useRouter } from "next/router";
import { ExtendedEvent } from "@/types/Event";
import campusList from "@/resources/campus-list";
import audienceList from "@/resources/audience-list";
import { useReport } from "@/components/Report/Wrapper";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/Session";

const HeroDetails = dynamic(
	() =>
		import("@/components/Event/Hero/Details").then((mod) => mod.HeroDetails),
	{ ssr: false }
);

export const HeroSection = ({
	id,
	title,
	date,
	location,
	campus,
	audience,
	creator,
	isParticipant,
	isOwner,

	participate,
}: {
	id: string;
	title: string;
	date: Date;
	location: string;
	campus: string;
	audience: string;
	creator: User;

	isParticipant: boolean;
	isOwner: boolean;

	participate: () => void;
}) => {
	const campusDisplay = campusList.find((c) => c.value === campus)?.label;
	const audienceDisplay = audienceList.find(
		(a) => a.value === audience
	)?.shortLabel;

	const { openReportModal } = useReport();

	const router = useRouter();
	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};
	return (
		<div className="flex flex-col w-full">
			<div className="inline-flex items-end justify-between w-full">
				<div className="inline-flex items-end overflow-hidden text-white uppercase">
					<div
						className={classNames(
							"hidden sm:inline-block", // responsive : hidden on small screens like mobile
							"relative mb-8 ml-12 bg-black py-1 pr-4 text-sm",
							"before:absolute before:top-[3.8rem] before:w-[11rem] before:h-[150%] before:bg-black before:translate-x-[-100%] before:left-0 before:skew-y-[-35deg]",
							"after:translate-y-[100%] after:absolute after:bg-black after:right-[7.85rem] after:bottom-0 after:w-[150%] after:h-[11rem] after:skew-x-[-55deg] "
						)}
					>
						<div className="inline-flex items-start py-2 divide-x-2 divide-white gap-x-4">
							<div className="flex flex-col">
								<span className="">Campus</span>
								<strong
									// @ts-ignore
									before="_"
									className={classNames(
										"relative -mt-1.5 -mb-1 w-min md:w-auto",
										"before:content-[attr(before)] before:absolute before:right-[100%]"
									)}
								>
									{campusDisplay}
								</strong>
							</div>
							<div className="flex flex-col pl-4">
								<span className="">Invités</span>
								<strong
									// @ts-ignore
									before="_"
									className={classNames(
										"relative -mt-1.5 -mb-1 w-min xs:w-auto",
										"before:content-[attr(before)] before:absolute before:right-[100%]"
									)}
								>
									{audienceDisplay}
								</strong>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-row items-end justify-between w-full overflow-hidden md:ml-2 sm:w-auto sm:gap-2 sm:justify-start md:pr-2 lg:ml-0">
					<button
						onClick={() => router.back()}
						className="btn-black w-fit pl-2.5 min-w-fit py-2.5 sm:ml-5"
					>
						<MdChevronLeft className="w-4 h-4" />
						Retour
					</button>
					<div className="inline-flex items-end md:gap-x-2">
						{isOwner && (
							<Link
								href={`/event/${id}/edit`}
								className="py-2.5 btn-black w-fit px-2 sm:px-4 "
							>
								<MdEdit className="w-4 h-4 my-0.5" />
								<span className="sr-only">{"Modifier l'événement"}</span>
							</Link>
						)}
						<button
							className="py-2.5 btn-black w-fit px-2 sm:px-4"
							onClick={() => participate()}
						>
							{isParticipant ? "Ne plus participer" : "Participer"}
						</button>
						{user?.id !== creator.id ? (
							<button
								className="py-2.5 btn-black w-fit px-2 sm:px-4"
								onClick={() =>
									openReportModal({
										content: "",
										object: ReportObject.EVENT,
										objectId: id,
										type: ReportType.OTHER,
										page: `/event/${id}`,
									})
								}
							>
								<MdWarning className="w-4 h-4 my-0.5" />
								<span className="sr-only">{"Signaler l'événement"}</span>
							</button>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex flex-col border-t border-black lg:flex-row">
				<Header text={title} className="text-[2.5rem] md:text-[4rem]" />
				<HeroDetails
					event={
						{
							title,
							audience,
							audienceCampus: campus,
							creator,
							date,
							location,
							id,
							// participants,
							// coordinates,
							// createdAt,
							// creatorId,
							// updatedAt,
						} as ExtendedEvent
					}
				/>
			</div>
		</div>
	);
};
