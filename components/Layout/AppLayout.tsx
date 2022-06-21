import { ReactNode } from "react";

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="w-screen h-full min-h-screen px-8 py-4 bg-white">{children}</div>
  );
};
