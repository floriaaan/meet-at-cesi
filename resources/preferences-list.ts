import { PreferencePrivacy } from "@prisma/client";

export const preferencesList = [
  {
    value: PreferencePrivacy.PUBLIC,
    label: "Campus et promotion visibles",
  },
  {
    value: PreferencePrivacy.PRIVATE,
    label: "Campus et promotion invisibles",
  },
  {
    value: PreferencePrivacy.CAMPUS_ONLY,
    label: "Campus visible, promotion invisible",
  },
  {
    value: PreferencePrivacy.PROMOTION_ONLY,
    label: "Campus invisible, promotion visible",
  },
];
