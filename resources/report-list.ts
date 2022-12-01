import { ReportType, ReportObject } from "@prisma/client";

export const reportReasonList: {
  label: string;
  value: ReportType;
}[] = [
  { label: "Autre", value: ReportType.OTHER },
  { label: "Contenu inapproprié", value: ReportType.INAPPROPRIATE },
  { label: "Spam", value: ReportType.SPAM },
];

export const reportObjectList: {
  label: string;
  value: ReportObject;
  fullLabel: string;
}[] = [
  {
    label: "Commentaire",
    value: ReportObject.COMMENT,
    fullLabel: "le commentaire",
  },
  { label: "Événement", value: ReportObject.EVENT, fullLabel: "l'événement" },
  {
    label: "Utilisateur",
    value: ReportObject.USER,
    fullLabel: "l'utilisateur",
  },
];
