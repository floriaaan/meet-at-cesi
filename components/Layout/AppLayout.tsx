import { Navbar } from "@/components/Layout/Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="h-full grow">{children}</main>
    </div>
  );
};
