import { ReactNode } from "react";

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="bg-white h-full w-screen min-h-screen p-8">{children}</div>
  );
};
