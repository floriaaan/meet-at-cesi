import classNames from "classnames";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

export type CustomTableProps = {
  title: string;
  subtitle?: string;
  items: any[];
  columns: string[];
  renderItem: (item: any) => ReactNode;
};

/**
 * Returns a generic custom table 
 * Behaves like a table and renders items via the passed render function.
 *
 * See `./pages/admin/even.tsx` for an example.
 *
 * TODO: need to add pagination, and specify object type for pagination prop
 */
const CustomTable = ({
  title,
  subtitle,
  columns,
  items,
  renderItem,
}: CustomTableProps) => {
  return (
    <div className="overflow-hidden bg-white border border-black border-dashed">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-bold leading-6 text-black">{title}</h3>
        <p className="max-w-2xl mt-1 text-sm text-neutral-500">
          {subtitle || "Détails et statistiques"}
        </p>
      </div>
      <div className="border-t border-black border-dashed">
        <table className="w-full overflow-x-scroll">
          <thead className={classNames("px-4 py-5 bg-neutral-50 md:px-6")}>
            <tr>
              {columns.map((column) => (
                <td
                  key={column}
                  className="p-4 text-sm font-medium text-left text-neutral-500"
                >
                  {column}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>{items.map((item) => renderItem(item))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CustomTable), {
  ssr: false,
});
