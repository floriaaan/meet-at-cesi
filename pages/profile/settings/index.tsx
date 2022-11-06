import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";

const ProfileSettingsPage: NextPage = () => {
  return (
    <AppLayout>
      <ProfileLayout>{"<hello world/>"}</ProfileLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;