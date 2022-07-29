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
  padding?: string;

  layoutId?: string;
}

interface MouseEvent {
  currentTarget: {
    // eslint-disable-next-line no-unused-vars
    appendChild: (arg0: HTMLSpanElement) => void;
    offsetLeft: number;
    offsetTop: number;
  };
  clientX: number;
  clientY: number;
}

const ripple = (e: MouseEvent) => {
  let ripple = document.createElement("span");
  ripple.classList.add("ripple");
  e.currentTarget.appendChild(ripple);
  let x = e.clientX - e.currentTarget.offsetLeft;
  let y = e.clientY - e.currentTarget.offsetTop;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  setTimeout(() => {
    ripple.remove();
  }, 700);
};

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
  padding = undefined,

  layoutId = undefined,
}: ButtonProps) => {
  const classes = classNames(
    "inline-flex items-center font-semibold font-heading",
    "ripple-able relative overflow-hidden active:appearence-none",
    {
      "bg-primary-100 text-primary-800": variant === "primary",
      "bg-secondary-100 text-secondary": variant === "secondary",
      "bg-tertiary-50 text-tertiary": variant === "tertiary",
    },

    padding || {
      "px-2 py-1": size === "small",
      "px-4 py-2": size === "medium",
      "px-6 py-6": size === "large",
    },
    className,
    rounded,
    icon ? "justify-between" : "justify-center"
  );

  const handleClick = (e: MouseEvent) => {
    ripple(e);
    if (onClick) {
      onClick();
    }
  };

  return href ? (
    <Link href={href}>
      <motion.a layoutId={layoutId} onClick={ripple} className={classes}>
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
