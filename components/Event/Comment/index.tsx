import { Avatar } from "@/components/UI/Avatar";
import { ExtendedComment } from "@/types/Event";

export const CommentListItem = ({ comment }: { comment: ExtendedComment }) => {
  return (
    <div className="inline-flex items-center w-full gap-2 p-2 border border-dashed">
      <Avatar className="w-12 h-12 border-2" user={comment.author} />
      <div className="flex flex-col gap-y-0.5">
        <div className="inline-flex items-center gap-x-2">
          <strong>{comment.author.name}</strong>
          <span className="text-sm text-gray-600">
            {new Date(comment.createdAt).toLocaleString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};
