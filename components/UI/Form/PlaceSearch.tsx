import { getPlaceSuggestions } from "@/lib/fetchers";
import { Prediction } from "@/types/Prediction";
import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { useRef, useState } from "react";
import { HiExclamationCircle } from "react-icons/hi2";

type InputProps = FieldHookConfig<string> & {
  labelClassName?: string;
  label: string;
  type: string;
};

export const PlaceSearch = ({
  label,
  labelClassName,
  type,
  className = "",
  ...props
}: InputProps) => {
  const [field, meta, helpers] = useField(
    props as FieldHookConfig<any>
  ) as unknown as [
    field: any,
    meta: {
      value: string;
      error: string;
      touched: boolean;
    },
    helpers: any
  ];
  const error = meta.touched && meta.error;

  let timeout = useRef();
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [preventFromFetching, setPreventFromFetching] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    const { value } = e.target;

    clearTimeout(timeout.current);

    if (!e.target.value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // @ts-ignore
    timeout.current = setTimeout(async () => {
      if (!preventFromFetching) {
        const res = await getPlaceSuggestions(value);
        setSuggestions(res);
        setIsOpen(true);
      }
    }, 2000);

    setPreventFromFetching(false);
  };

  const handleOnClickSuggestion = (e: React.MouseEvent) => {
    const { innerText } = e.target as HTMLInputElement;
    helpers.setValue(innerText);
    setSuggestions([]);
    setPreventFromFetching(true);
    setIsOpen(false);
  };

  return (
    <div className={classNames(className, "flex flex-col space-y-1 relative")}>
      {label ? (
        <label
          htmlFor={field.name}
          className={labelClassName || "font-bold text-black font-body"}
        >
          {label}
        </label>
      ) : null}

      <div className="flex-1">
        <div className="relative">
          <input
            {...field}
            {...props}
            onChange={handleOnChange}
            id={field.name}
            type={type}
            className={classNames(
              " py-1.5 lg:py-3 px-3  text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border ",
              error
                ? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
                : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            )}
          />
          {error && type !== "number" ? (
            <span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
              <HiExclamationCircle className="w-4 h-4 text-red-500 lg:w-6 lg:h-6" />
            </span>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="absolute z-10 flex flex-col w-full -bottom-1">
          {suggestions ? (
            <ul className="absolute w-full p-2 bg-white border border-gray-300 shadow-lg">
              {suggestions.map((s) => (
                <li
                  className="inline-flex w-full px-2 py-1 text-xs truncate cursor-pointer select-none hover:bg-gray-100"
                  key={s.place_id}
                  onClick={handleOnClickSuggestion}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <p
        className={classNames("text-sm first-letter:uppercase", {
          "text-red-600": error,
          "lg:h-5": !error || !meta.touched,
        })}
      >
        {error || " "}
      </p>
    </div>
  );
};
