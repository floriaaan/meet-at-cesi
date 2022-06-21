import classNames from "classnames";

interface CaptionProps {
  children: React.ReactNode;
  className?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "tertiary";
  rounded?: string;
  icon?: React.ReactNode;
}

export const Caption = ({
  children,
  variant = "tertiary",
  size = "medium",
  rounded = "rounded-[20px]",
  className,
  icon,
}: CaptionProps) => {
  const classes = classNames(
    "inline-flex  bg-opacity-50 items-center font-semibold font-heading",
    {
      "bg-primary-100 text-primary": variant === "primary",
      "bg-secondary-100 text-secondary": variant === "secondary",
      "bg-tertiary-50 text-tertiary": variant === "tertiary",
    },
    {
      "px-2 py-1": size === "small",
      "px-4 py-2": size === "medium",
      "px-6 py-6": size === "large",
    },
    className,
    rounded,
    icon ? "justify-between" : "justify-center"
  );

  return (
    <div className={classes}>
      {icon && <span className="w-px h-px"></span>}
      {children}
      {icon}
    </div>
  );
};
