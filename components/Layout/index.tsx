import { Navbar } from "@/components/Layout/Navbar";
import { RouterProgressBar } from "@/components/Helpers/RouterProgressBar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-auto min-h-[calc(100vh-3rem)] mb-10 md:mb-8 xl:mb-4">
      <div id="navbar-progressBar">
        <Navbar />
        <RouterProgressBar />
      </div>
      <main className="h-full grow">{children}</main>
    </div>
  );
};
