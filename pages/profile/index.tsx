import type { NextPage } from "next";

import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";

const ProfileIndexPage: NextPage = () => {
  return (
    <AppLayout>
      <ProfileLayout>{"<hello world/>"}</ProfileLayout>
    </AppLayout>
  );
};

export default ProfileIndexPage;
