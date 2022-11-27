import { useState } from "react";
import { useSession } from "next-auth/react";

import { ExtendedComment } from "@/types/Event";
import { CommentListItem } from "@/components/Event/Comment";
import { Chip } from "@/components/UI/Chip";
import { getPlural } from "@/lib/string";
import { CommentForm } from "@/components/Event/Comment/Form";
import { createComment } from "@/lib/fetchers";

export const CommentSection = ({
  initialComments,
  eventId,
}: {
  initialComments: ExtendedComment[];
  eventId: string;
}) => {
  const { data: session } = useSession();
  const { user } = session || {};
  const [comments, setComments] = useState<ExtendedComment[]>(initialComments);

  return (
    <div className="flex flex-col w-full p-4 bg-gray-100 border border-black border-dashed gap-y-2">
      <div className="inline-flex items-center text-xs font-bold md:text-base gap-x-1">
        <Chip extendClassName="bg-purple">{comments.length}</Chip>{" "}
        {getPlural(comments.length, "commentaire", "commentaires")}
      </div>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} setCommentList={setComments} />
      ))}
      {user && (
        <CommentForm
          onSubmit={async (values) => {
            const result = await createComment({ ...values, eventId });
            if (result && result.length > 0) {
              setComments(result);
              return result;
            }
            return false;
          }}
        />
      )}
    </div>
  );
};
