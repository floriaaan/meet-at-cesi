import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { MdChevronRight } from "react-icons/md";

type SelectProps = FieldHookConfig<string> & {
  labelClassName?: string;
  label: string;
  options: { value: string; label: string }[];
  canHaveError?: boolean;
};

const Select = ({
  label,
  labelClassName,
  className = "",
  options,
  canHaveError = true,
  ...props
}: SelectProps) => {
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
  const error = meta.touched && canHaveError ? meta.error : false;

  return (
    <div className={classNames(className, "flex flex-col space-y-1")}>
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
          <select
            {...field}
            {...props}
            id={field.name}
            className={classNames(
              "py-1.5 lg:py-3 px-3 pr-6 focus:outline-none appearance-none placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border bg-white text-[16px] sm:text-sm placeholder:text-sm",
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
          <MdChevronRight className="absolute w-4 h-4 m-2 mr-0 text-black rotate-90 pointer-events-none top-px lg:top-2 right-2" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 first-letter:uppercase">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
