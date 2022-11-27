import { Navbar } from "@/components/Layout/Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-auto min-h-screen mb-20 md:mb-16 xl:mb-6">
      <Navbar />
      <main className="h-full grow">{children}</main>
    </div>
  );
};
