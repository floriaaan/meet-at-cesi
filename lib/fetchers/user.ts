import { Preference, User } from "@prisma/client";

import { ExtendedUser } from "@/types/User";

export type UserSearchRequestInput = {
  name?: string;
  offset: number;
};

export const searchUsers = async (
  params: UserSearchRequestInput
): Promise<User[]> => {
  const response = await fetch(`/api/user/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (response.ok) {
    const { users } = await response.json();
    return users;
  }
  return [];
};

type EditPreferencesRequest = {
  campus?: string;
  promotion?: string;
  promotionYear?: string;
};
export const editPreferences = async ({
  campus,
  promotion,
  promotionYear,
}: EditPreferencesRequest): Promise<{ user: ExtendedUser } | false> => {
  const response = await fetch(`/api/user/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campus, promotion, promotionYear }),
  });
  if (response.ok) {
    const { user } = await response.json();
    return { user };
  }
  return false;
};

export const uploadImage = async (image: string): Promise<string | false> => {
  const res = await fetch("/api/user/image-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });
  const { url } = await res.json();
  if (res.ok) return url;
  return false;
};

export const deleteImage = async (): Promise<boolean> => {
  const res = await fetch("/api/user/image-upload", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) return true;
  return false;
};

export const getPreferences = async (): Promise<Preference | undefined> => {
  const res = await fetch("/api/user/preferences");
  const { preferences } = await res.json();
  if (res.ok) return preferences || undefined;
  return undefined;
};

export const sendVerificationEmail = async (): Promise<boolean> => {
    const res = await fetch("/api/user/email-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) return true;
    return false;
  };
  