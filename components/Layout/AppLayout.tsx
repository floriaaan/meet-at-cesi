import classNames from "classnames";
import { ReactNode, useEffect } from "react";

export const AppLayout = ({
  children,
  padding = "",
  allowScroll = false,
}: {
  children?: ReactNode;
  padding?: string;
  allowScroll?: boolean;
}) => {
  useEffect(() => {
    if (allowScroll) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [allowScroll]);

  return (
    <div
      className={classNames(
        "w-screen h-full min-h-screen  bg-white",
        padding || "px-8 py-4"
      )}
    >
      {children}
    </div>
  );
};
