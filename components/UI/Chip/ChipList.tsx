import classNames from "classnames";
import { Dispatch } from "react";
import { Chip, ChipElement } from "./Chip";

export const ChipList = ({
  list = [],
  selected = undefined,
  setSelected,
  color = undefined,
  size = "normal",
}: {
  list: ChipElement[];
  selected?: ChipElement;
  setSelected?: Dispatch<ChipElement> | null;
  color?: string;
  size: "normal" | "small";
}) => {
  return (
    <div
      className={classNames(
        "inline-flex items-center max-w-max  overflow-x-auto ",
        { "space-x-2": size === "normal", "space-x-1": size === "small" }
      )}
    >
      {list.map((el, index) => {
        return (
          <Chip
            color={color}
            element={el}
            key={index}
            size={size}
            checked={selected?.value === el.value}
            onClick={setSelected ? () => setSelected(el) : null}
          />
        );
      })}
    </div>
  );
};
