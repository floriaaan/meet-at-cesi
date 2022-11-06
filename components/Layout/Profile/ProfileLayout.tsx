import { ProfileLayoutSidebar } from "@/components/Layout/Profile/Sidebar";

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row w-full h-full">
      <ProfileLayoutSidebar />
      {children}
    </div>
  );
};
