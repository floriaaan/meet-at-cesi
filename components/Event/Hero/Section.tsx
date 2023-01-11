import { ReportObject, ReportType, User } from "@prisma/client";

import classNames from "classnames";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MdChevronLeft, MdEdit, MdLock, MdWarning } from "react-icons/md";

import { ExtendedSession } from "@/types/Session";
import { Header } from "@/components/UI/Header";
import { ExtendedEvent } from "@/types/Event";
import { campusList } from "@/resources/campus-list";
import { audienceList } from "@/resources/audience-list";
import { useReport } from "@/components/Report/Wrapper";

const HeroDetails = dynamic(
	() =>
		import("@/components/Event/Hero/Details").then((mod) => mod.HeroDetails),
	{ ssr: false },
);

export const HeroSection = ({
	id,
	title,
	date,
	location,
	campus,
	audience,
	creator,
	private: isPrivate,

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

	private: boolean;

	isParticipant: boolean;
	isOwner: boolean;

	participate: () => void;
}) => {
	const campusDisplay = campusList.find((c) => c.value === campus)?.label;
	const audienceDisplay = audienceList.find((a) => a.value === audience);

	const { openReportModal } = useReport();

	const router = useRouter();
	const { data: session, status } = useSession();
	const { user } = (session as ExtendedSession) || {};
	return (
		<div className="flex flex-col w-full ">
			<div className="inline-flex items-end justify-between w-full">
				<div className="inline-flex items-end overflow-hidden text-white uppercase dark:text-black">
					<div
						className={classNames(
							"hidden sm:inline-block", // responsive : hidden on small screens like mobile
							"relative mb-8 ml-12 bg-black  dark:bg-primary py-1 pr-4 text-xs md:text-sm max-w-sm xl:max-w-md",
							"before:absolute before:top-[3.8rem] before:w-[11rem] before:h-[150%] before:dark:bg-primary before:bg-black before:translate-x-[-100%] before:left-0 before:skew-y-[-35deg]",
							"after:translate-y-[100%] after:absolute after:bg-black  after:dark:bg-primary after:right-[7.85rem] after:bottom-0 after:w-[150%] after:h-[11rem] after:skew-x-[-55deg] ",
						)}
					>
						<div className="inline-flex items-start py-2 divide-x-2 divide-white dark:divide-black gap-x-4">
							{campusDisplay !== null ? (
								<div className="flex flex-col">
									<span className="">Campus</span>
									<strong
										data-before="_"
										className={classNames(
											"relative xs:-mt-1.5 -mb-1 w-min md:w-auto",
											"before:content-[attr(data-before)] before:absolute before:right-[100%]",
										)}
									>
										{campusDisplay}
									</strong>
								</div>
							) : null}
							{audienceDisplay !== undefined && !isPrivate ? (
								<div className="flex flex-col pl-4">
									<span className="">Invités</span>
									<strong
										data-before="_"
										className={classNames(
											"relative -mb-1 w-min leading-3  xs:w-auto line-clamp-2 whitespace-pre-line",
											"before:content-[attr(data-before)] before:absolute before:right-[100%]",
										)}
									>
										{`${audienceDisplay?.domaine}\n${audienceDisplay?.niveau}`}
									</strong>
								</div>
							) : null}
							{isPrivate ? (
								<div className="flex flex-col pl-4">
									<span className="">Événement</span>
									<strong
										data-before="_"
										className={classNames(
											"relative -mb-1 w-min leading-3 inline-flex items-center xs:w-auto line-clamp-2 whitespace-pre-line",
											"before:content-[attr(data-before)] before:absolute before:right-[100%]",
										)}
									>
										Privé
										<MdLock className="inline-block w-4 h-4 ml-1" />
									</strong>
								</div>
							) : null}
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
					{status === "authenticated" && (
						<div className="inline-flex items-end md:gap-x-2">
							{isOwner && (
								<Link
									href={`/event/${id}/edit`}
									className="py-2.5 btn-black w-fit px-2 "
								>
									<MdEdit className="w-4 h-4 my-0.5" />
									<span className="sr-only">{"Modifier l'événement"}</span>
								</Link>
							)}
							<button
								className="py-2.5 btn-black w-fit px-2 sm:px-3"
								onClick={() => participate()}
							>
								{isParticipant ? "Se retirer" : "Participer"}
							</button>
							{user?.id !== creator.id ? (
								<button
									className="py-2.5 btn-black w-fit px-2 sm:px-3"
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
					)}
				</div>
			</div>

			<div className="flex flex-col border-t dark:border-t-neutral-950 border-t-black lg:flex-row">
				<Header
					text={title}
					className="text-[2.5rem] md:text-[4rem]"
					containerClassName={classNames("lg:grow", {
						"bg-purple": isPrivate,
					})}
					textCanOverflow
				/>
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
							private: isPrivate,
						} as ExtendedEvent
					}
					className={isPrivate ? "bg-purple" : ""}
				/>
			</div>
		</div>
	);
};
