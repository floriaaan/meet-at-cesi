import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { HiExclamationCircle } from "react-icons/hi2";

type InputProps = FieldHookConfig<string> & {
  label: string;
  type: string;
};

const Input = ({ label, type, className = "", ...props }: InputProps) => {
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
          <input
            {...field}
            {...props}
            type={type}
            className={classNames(
              "py-3 px-3  text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border ",
              error
                ? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
                : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
            )}
          />
          {error && type !== "number" ? (
            <span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
              <HiExclamationCircle className="w-6 h-6 text-red-500" />
            </span>
          ) : null}
        </div>
      </div>

      <p
        className={classNames("text-sm first-letter:uppercase", {
          "text-red-600": error,
          "h-5": !error || !meta.touched,
        })}
      >
        {error || " "}
      </p>
    </div>
  );
};

export default Input;