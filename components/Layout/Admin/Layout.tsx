import { Subnav } from "@/components/Layout/Admin/Subnav";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-auto" aria-label="Admin wrapper">
      <Subnav />
      {children}
    </div>
  );
};
