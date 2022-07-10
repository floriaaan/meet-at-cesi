import classNames from "classnames";

type Props = {
  left?: React.ReactNode | JSX.Element;
  right?: React.ReactNode | JSX.Element;
  title?: React.ReactNode | JSX.Element | string;
  padding?: string;
};

export const StickyHeader = ({ left, right, title, padding = "" }: Props) => {
  return (
    <div
      className={classNames(
        "sticky top-0 left-0 flex flex-col w-full  bg-opacity-90 backdrop-blur-lg filter",
        padding || "pt-4 pb-2"
      )}
    >
      <div
        className={classNames(
          "inline-flex items-center justify-between w-full",
          {
            "mb-4": title,
          }
        )}
      >
        {left || <span className="w-px h-px"></span>}
        {right || <span className="w-px h-px"></span>}
      </div>
      {typeof title === "string" ? (
        <h2 className="text-2xl font-bold font-heading">{title}</h2>
      ) : (
        title
      )}
    </div>
  );
};
