import { useState } from "react";

import { ExtendedComment } from "@/types/Event";
import { CommentListItem } from "@/components/Event/Comment";
import { Chip } from "@/components/UI/Chip";
import { getPlural } from "@/lib/string";

export const CommentSection = ({
  initialComments,
}: {
  initialComments: ExtendedComment[];
}) => {
  const [comments, setComments] = useState<ExtendedComment[]>(initialComments);

  return (
    <div className="flex flex-col w-full p-4 bg-gray-100 gap-y-2">
      <div className="inline-flex items-center text-xs font-bold gap-x-1">
        <Chip extendClassName="bg-purple">{comments.length}</Chip>{" "}
        {getPlural(comments.length, "commentaire", "commentaires")}
      </div>
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
