import { ExtendedComment } from "@/types/Event";
import { CommentListItem } from ".";

type ReplyListProps = {
  replies: ExtendedComment[];
  setCommentList: (comments: ExtendedComment[]) => void;
};

export const ReplyList = ({ replies, setCommentList }: ReplyListProps) => {
  return (
    <div className="w-full flex flex-col grow gap-y-0.5">
      {replies.map((reply) => (
        <CommentListItem
          isReply={true}
          comment={reply}
          setCommentList={setCommentList}
          key={reply.id}
        />
      ))}
    </div>
  );
};
