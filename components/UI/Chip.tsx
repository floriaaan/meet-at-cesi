import classNames from "classnames";

type ChipProps = {
  children: React.ReactNode;
  className?: string;
  extendClassName?: string;
};

export const Chip = ({ children, className, extendClassName }: ChipProps) => {
  return (
    <span
      className={
        className ||
        classNames(
          "text-xs font-bold text-white bg-black py-0.5 px-2",
          extendClassName
        )
      }
    >
      {children}
    </span>
  );
};
