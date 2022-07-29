import classNames from "classnames";
import Image from "next/image";

export type Avatar = {
  src: string;
  alt: string;
  size?: string;
  className?: string;
  rounded?: string;
};

export const Avatar = ({
  src,
  alt,
  size = "w-12 h-12",
  className,
  rounded = "rounded-full",
}: Avatar) => {
  return (
    <a className={classNames("relative", size, className)}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className={classNames(rounded)}
        onError={(e: { currentTarget: { src: string } }) => {
          e.currentTarget.src = "/images/avatar.png";
        }}
      />
    </a>
  );
};
