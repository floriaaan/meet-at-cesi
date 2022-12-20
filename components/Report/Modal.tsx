import { useReport } from "@/components/Report/Wrapper";
import { ReportForm } from "@/components/Report/Form";
import { createReport } from "@/lib/fetchers";
import { reportObjectList } from "@/resources/report-list";
import { Modal } from "@/components/UI/Modal";

export const ReportModal = () => {
	const {
		object,
		isReportModalOpen: isOpen,
		setIsReportModalOpen,
	} = useReport();
	const closeModal = () => setIsReportModalOpen(false);

	return (
		<Modal
			title={`Signaler ${
				reportObjectList.find((o) => o.value === object.object)?.fullLabel ||
				"cette ressource"
			}`}
			isOpen={isOpen}
			onClose={closeModal}
		>
			<ReportForm
				submitClassName="w-full btn-black text-sm border-b"
				labelClassName="text-xs font-bold font-black"
				onSubmit={createReport}
			/>
		</Modal>
	);
};
