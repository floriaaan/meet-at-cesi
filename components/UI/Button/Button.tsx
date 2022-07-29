import classNames from "classnames";
import { motion } from "framer-motion";
import Link from "next/link";
import { Spinner } from "../Spinner";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  type?: "button" | "submit" | "reset";
  rounded?: string;
  icon?: React.ReactNode;

  layoutId?: string;
}

export const Button = ({
  children,
  className,
  href,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  type = "button",
  rounded = "rounded-[20px]",
  icon,

  layoutId = undefined,
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
    href ? "ripple-able relative overflow-hidden active:appearence-none" : ""
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return href ? (
    <Link href={href}>
      <motion.a
        layoutId={layoutId}
        onClick={(e) => {
          let ripple = document.createElement("span");

          // Add ripple class to span
          ripple.classList.add("ripple");

          // Add span to the button
          e.currentTarget.appendChild(ripple);

          // Get position of X
          let x = e.clientX - e.currentTarget.offsetLeft;

          // Get position of Y
          let y = e.clientY - e.currentTarget.offsetTop;

          // Position the span element
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;

          // Remove span after 0.3s
          setTimeout(() => {
            ripple.remove();
          }, 700);
        }}
        className={classes}
      >
        {icon}
        {loading ? <Spinner size={size} /> : children}
        {icon && <span className="w-px h-px"></span>}
      </motion.a>
    </Link>
  ) : (
    <motion.button
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      type={type}
      layoutId={layoutId}
    >
      {icon}
      {loading ? <Spinner size={size} /> : children}
      {icon && <span className="w-px h-px"></span>}
    </motion.button>
  );
};
