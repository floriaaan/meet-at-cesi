import { Navbar } from "./Navbar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
