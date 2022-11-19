import classNames from "classnames";
import { MdSearch } from "react-icons/md";

import { Spinner } from "@/components/UI/Spinner";

type Props = {
  className?: string;
  loading?: boolean;
};

export const SearchBar = ({ className, loading }: Props) => {
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
          "relative shrink inline-flex w-full rounded-full",
          className
        )}
      >
        <MdSearch className="absolute hidden sm:block w-6 h-6 m-2 pointer-events-none top-1.5 left-2 text-purple" />
        <input
          id="search"
          type="text"
          className="px-4 py-2 text-sm rounded-l-full sm:py-3 sm:pl-12 sm:pr-6 grow placeholder:italic"
          placeholder="Rechercher un événement..."
        />
        <button
          type="submit"
          className="px-4 py-2 font-bold rounded-r-full sm:pl-6 sm:pr-8 sm:py-3 font-body shrink-0 btn__colors"
        >
          {loading ? <Spinner className="w-6 h-6 ml-0.5 text-black" /> : "GO"}
        </button>
      </div>
    </>
  );
};
