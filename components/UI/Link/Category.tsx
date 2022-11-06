import classNames from "classnames";
import Link from "next/link";

export type CategoryOptions = {
  name: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type CategoryProps = {
  title: string;
  options: CategoryOptions[];
  size?: "sm" | "lg";
};

export const Category = ({ title, options }: CategoryProps) => (
  <div className="flex flex-col gap-y-1">
    <span
      className={classNames(
        "relative font-bold select-none",
        "before:absolute before:bottom-0 before:h-[0.2rem] before:w-4 before:bg-primary"
      )}
    >
      {title}
    </span>
    <div className="flex flex-col pl-4 gap-y-1">
      {options.map(({ name, href, onClick, disabled }, i) =>
        href ? (
          <Link
            key={`${title}-${i}`}
            href={href}
            className="p-0 font-normal normal-case nav__link"
          >
            {name}
          </Link>
        ) : (
          <button
            disabled={disabled || false}
            key={`${title}-${i}`}
            className="p-0 font-normal normal-case nav__link"
            onClick={onClick}
          >
            {name}
          </button>
        )
      )}
    </div>
  </div>
);
