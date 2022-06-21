import classNames from "classnames";
import { Spinner } from "../Spinner";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  rounded?: string;
  icon?: React.ReactNode;
}

export const Button = ({
  children,
  className,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  type = "button",
  rounded = "rounded-[20px]",
  icon
}: ButtonProps) => {
  const classes = classNames(
    "inline-flex items-center font-semibold font-heading",
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
    icon ? "justify-between" : "justify-center",
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
    >
        {icon}
      {loading ? <Spinner size={size} /> : children}
      {icon && <span className="w-px h-px"></span>}
    </button>
  );
};
