import { ProfileLayoutSidebar } from "@/components/Layout/Profile/Sidebar";

export const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full min-h-full grow" aria-label="Profile wrapper">
      <ProfileLayoutSidebar />
      <div className="flex flex-col w-full h-full overflow-y-auto grow" aria-label="Profile main section">
      {children}
      </div>
    </div>
  );
};
