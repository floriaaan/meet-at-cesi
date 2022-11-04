import classNames from "classnames";
import { MdSearch } from "react-icons/md";

type Props = {
  className?: string;
};

export const Searchbar = ({ className }: Props) => {
  return (
    <>
      <label
        htmlFor="search"
        className="mr-auto font-bold text-black font-body"
      >
        {"Trouvez l'événement qui vous correspond"}
      </label>
      <div
        className={classNames(
          "relative inline-flex w-full rounded-full",
          className
        )}
      >
        <MdSearch className="absolute w-6 h-6 m-2 pointer-events-none top-1.5 left-2 text-purple" />
        <input
          id="search"
          type="text"
          className="py-3 pl-12 pr-6 text-sm rounded-l-full grow placeholder:italic"
          placeholder="Rechercher un événement..."
        />
        <button
          type="submit"
          className="py-3 pl-6 pr-8 font-bold rounded-r-full font-body shrink-0 btn__colors"
        >
          GO
        </button>
      </div>
    </>
  );
};
