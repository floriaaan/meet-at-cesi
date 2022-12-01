import { ReportObject, ReportType } from "@prisma/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReportModal } from "@/components/Report/Modal";
import { ReportCreateRequestInput } from "@/lib/fetchers";

type ReportContextType = {
  object: ReportCreateRequestInput;

  isReportModalOpen: boolean;
  setIsReportModalOpen: (isOpen: boolean) => void;

  openReportModal: (report: ReportCreateRequestInput) => void;
};
const ReportContext = createContext({});
export const useReport = () => useContext(ReportContext) as ReportContextType;

const DEFAULT_STATE = {
  content: "",
  page: "",
  object: ReportObject.NULL,
  objectId: "",
  type: ReportType.OTHER,
} as ReportCreateRequestInput;

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [object, setObject] = useState<ReportCreateRequestInput>(DEFAULT_STATE);

  useEffect(() => {
    if (!isReportModalOpen) setObject(DEFAULT_STATE);
  }, [isReportModalOpen]);

  const openReportModal = (report: ReportCreateRequestInput) => {
    setObject(report);
    setIsReportModalOpen(true);
  };

  return (
    <ReportContext.Provider
      value={{
        object,
        isReportModalOpen,
        setIsReportModalOpen,
        openReportModal,
      }}
    >
      {children}
      <ReportModal />
    </ReportContext.Provider>
  );
};
