import { Navbar } from "@/components/Layout/Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-auto min-h-screen">
      <Navbar />
      <main className="h-full mb-20 sm:mb-6 grow">{children}</main>
    </div>
  );
};
