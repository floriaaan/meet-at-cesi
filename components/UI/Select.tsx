import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { HiChevronDown } from "react-icons/hi2";

type SelectProps = FieldHookConfig<string> & {
  label: string;
  options: { value: string; label: string }[];
};

const Select = ({ label, className = "", options, ...props }: SelectProps) => {
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

  return (
    <div className={classNames(className, "flex flex-col space-y-1")}>
      {label ? (
        <label htmlFor="email" className="font-bold text-black font-body">
          {label}
        </label>
      ) : null}

      <div className="flex-1">
        <div className="relative">
          <select
            {...field}
            {...props}
            className={classNames(
              "py-3 px-3 pr-6 text-sm appearance-none placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border bg-white",
              error
                ? "border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            )}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <HiChevronDown className="absolute pointer-events-none w-4 h-4 m-2 stroke-[1.25] top-2 right-2 text-black" />
        </div>
      </div>

      <p
        className={classNames("text-sm first-letter:uppercase", {
          "text-red-600": error,
          "h-5": !error && !meta.touched,
        })}
      >
        {error || ""}
      </p>
    </div>
  );
};

export default Select;
