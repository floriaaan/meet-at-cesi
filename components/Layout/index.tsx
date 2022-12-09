import { Navbar } from "@/components/Layout/Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-auto min-h-[calc(100vh-3rem)] mb-10 md:mb-8 xl:mb-4">
      <Navbar />
      <main className="h-full grow">{children}</main>
    </div>
  );
};
