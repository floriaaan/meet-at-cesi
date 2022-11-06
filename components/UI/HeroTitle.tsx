import classNames from "classnames";

type HeroTitleProps = {
  text: string;
  className?: string;
};

export const HeroTitle = ({ text, className }: HeroTitleProps) => {
  return (
    <div className="w-full p-6 pb-8 text-black bg-primary">
      <h1
        className={classNames(
          "text-[4rem] relative font-bold leading-none md:leading-normal font-heading",
          "before:block before:absolute before:-bottom-2 md:before:bottom-2 before:left-2 md:before:left-6 before:bg-white before:w-32 before:h-3",
          className
        )}
      >
        {text}
      </h1>
    </div>
  );
};
