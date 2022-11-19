type ChipProps = {
  children: React.ReactNode;
  className?: string;
};

export const Chip = ({ children, className }: ChipProps) => {
  return (
    <span
      className={
        className || "text-xs font-bold text-white bg-black py-0.5 px-2"
      }
    >
      {children}
    </span>
  );
};
