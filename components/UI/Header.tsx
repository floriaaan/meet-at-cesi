import classNames from "classnames";
import type { ReactNode } from "react";

type HeaderProps = {
  text: string | ReactNode;
  className?: string;
  containerClassName?: string;
};

export const Header = ({
  text,
  className,
  containerClassName,
}: HeaderProps) => {
  return (
    <div
      className={classNames(
        "w-full p-6 pb-8",
        containerClassName,
        !containerClassName?.includes("bg-") ? "text-black bg-primary" : ""
      )}
    >
      <h1
        className={classNames(
          "relative font-bold leading-none md:leading-normal font-heading",
          "before:block before:absolute before:-bottom-2 md:before:bottom-2 before:left-2 md:before:left-6 before:bg-white before:w-32 before:h-3",
          className,
          className?.includes("text-") ? "" : "text-[4rem]"
        )}
      >
        {text}
      </h1>
    </div>
  );
};
