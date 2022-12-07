import { Avatar } from "@/components/UI/Avatar";
import { Name } from "@/components/UI/Avatar/OnlyName";
import { formatDate, formatRelative } from "@/lib/date";
import { ExtendedComment } from "@/types/Event";
import Link from "next/link";

export const CommentFeedItem = ({
  author,
  content,
  eventId,
  event: { title },
  createdAt,
  id,
}: ExtendedComment) => {
  return (
    <Link
      href={`/event/${eventId}#${id}`}
      className="w-full pb-2 border-b border-gray-200 border-dotted group last:border-0 last:pb-0"
    >
      <div className="inline-flex items-center w-full gap-2 ">
        <Avatar user={author} className="w-10 h-10 shrink-0" />
        <div className="flex flex-col gap-1 text-xs truncate md:text-sm">
          <div className="inline-flex items-center gap-x-1">
            <Name user={author} />
            <span className="items-center hidden truncate whitespace-nowrap md:inline-flex gap-x-1">
              sur
              <strong className="decoration-dashed underline-offset-1 group-hover:underline">
                {title}
              </strong>
            </span>
            {createdAt ? <>&bull; il y a {formatRelative(createdAt)}</> : null}
          </div>
          <p className="text-sm leading-4 decoration-dashed underline-offset-1 group-hover:underline w-fit ">
            {content}
          </p>
        </div>
      </div>
    </Link>
  );
};
