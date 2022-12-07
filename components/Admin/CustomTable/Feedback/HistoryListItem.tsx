import routes from "@/resources/routes";
import Link from "next/link";

type HistoryListItemProps = {
  route: string;
};

export const HistoryListItem = ({ route }: HistoryListItemProps) => {
  return <Link href={route} className="text-xs hover:underline p-0.5">{routes[route as keyof typeof routes]}</Link>;
};
