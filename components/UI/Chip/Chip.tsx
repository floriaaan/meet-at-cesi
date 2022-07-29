import classNames from "classnames";


export interface ChipElement {
  label: string;
  value: string;
}

export const Chip = ({
  onClick,
  checked = false,
  element,
  size = "normal",
}: {
  onClick?: any;
  color?: string;
  checked?: boolean;
  element: ChipElement;
  size: "normal" | "small";
}) => {
  return (
    <div
      onClick={onClick ? onClick : () => {}}
      className={classNames(
        "inline-flex items-center justify-center w-max transition duration-300 rounded-md select-none ",
        {
          "cursor-pointer": onClick,
          "px-3 py-1.5": size === "normal",
          "px-1.5 py-1": size === "small",
          "bg-[#EB9800] text-white font-semibold": checked,
          "bg-secondary-50 text-secondary-500 font-medium": !checked,
        }
      )}
    >
      <div
        className={classNames(
          "inline-flex items-center leading-none select-none min-w-max w-full ",
          size === "normal" ? "text-sm" : "text-xs"
        )}
      >
        {element.label}
        {/* {checked && (
          <div className="ml-3">
            <div style={{ fontSize: size === "normal" ? "0.6rem" : "0.5rem" }}>
              &#10003;
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};
