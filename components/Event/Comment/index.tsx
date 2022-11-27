import { useState } from "react";
import { MdDelete, MdEdit, MdEditOff, MdReply } from "react-icons/md";

import {
  CommentForm,
  CommentFormValues,
} from "@/components/Event/Comment/Form";
import { Avatar } from "@/components/UI/Avatar";
import { ExtendedComment } from "@/types/Event";
import { createComment, deleteComment, editComment } from "@/lib/fetchers";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/Session";
import PopperMenu from "@/components/Helpers/PopperMenu";
import classNames from "classnames";
import toast from "react-hot-toast";
import toastStyle from "@/resources/toast.config";
import { ReplyList } from "./ReplyList";
import { formatDate, formatRelative } from "@/lib/date";

type CommentListItemProps = {
  comment: ExtendedComment;
  setCommentList: (comments: ExtendedComment[]) => void;
  isReply?: boolean;
};

export const CommentListItem = ({
  comment,
  setCommentList,
  isReply = false,
}: CommentListItemProps) => {
  const { data: session } = useSession();
  const { user, id: userId } = (session as ExtendedSession) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { content, author, children, createdAt, isDeleted } = comment;

  return (
    <div className="inline-flex items-start w-full gap-1 p-1 overflow-hidden duration-300 border border-dashed md:gap-2 md:p-2 hover:border-gray-300">
      <Avatar
        className={classNames(
          !isReply ? "lg:w-12 lg:h-12 w-6 h-6 " : "w-6 h-6 lg:w-8 lg:h-8",
          !isDeleted && "lg:border-2"
        )}
        user={author || { name: "Anonymous" }}
      />
      <div className="flex flex-col w-full md:flex-row md:items-start">
        <div className="flex flex-col gap-y-0.5 grow w-full">
          <div
            className={classNames(
              "inline-flex items-center gap-x-1 md:gap-x-2"
            )}
          >
            <strong
              className={classNames(
                "whitespace-nowrap text-xs",
                !isReply ? "md:text-base" : ""
              )}
            >
              {author?.name || "Commentaire supprimé"}
            </strong>
            {!isDeleted ? (
              <span className="inline-flex items-center gap-1">
                &bull;
                <span
                  className={classNames(
                    "block text-gray-600 truncate text-xs",
                    !isReply ? "md:text-sm" : ""
                  )}
                >
                  {createdAt ? formatRelative(createdAt) : null}
                </span>
                <span
                  className={classNames(
                    "hidden md:inline-flex text-gray-600 truncate text-xs",
                    !isReply ? "md:text-sm" : ""
                  )}
                >
                  <span className="mr-1">-</span>
                  {createdAt ? formatDate(createdAt) : null}
                </span>
              </span>
            ) : (
              <span
                className={classNames(
                  "block text-gray-500 truncate text-xs",
                  !isReply ? "md:text-sm" : ""
                )}
              >
                supprimé
              </span>
            )}
          </div>
          <div className="flex flex-col w-full grow gap-y-1">
            {!isEditing || isDeleted ? (
              <p className="text-sm">{content}</p>
            ) : (
              <CommentForm
                isEditing
                initialValues={
                  { content: comment.content } as CommentFormValues
                }
                onSubmit={async (values) => {
                  const result = await editComment({
                    ...values,
                    commentId: comment.id,
                  });
                  if (result) {
                    setCommentList(result);
                    setIsEditing(false);
                    return result;
                  }
                  return false;
                }}
              />
            )}
            <ReplyList
              replies={children || []}
              setCommentList={setCommentList}
            />
          </div>
        </div>
        {!isReply && !isDeleted && isReplying ? (
          <div className="w-full">
            <CommentForm
              isReplying
              onSubmit={async (values) => {
                const result = await createComment({
                  ...values,
                  parentId: comment.id,
                  eventId: comment.eventId,
                });
                if (result) {
                  setCommentList(result);
                  setIsReplying(false);
                  return result;
                }
                return false;
              }}
            />
          </div>
        ) : null}
        <div className="inline-flex items-center md:gap-1 shrink-0">
          {!isReply && !isDeleted && user ? (
            <button
              type="button"
              className="p-1 text-xs font-bold border border-transparent border-dashed hover:border-black"
              onClick={() => setIsReplying(!isReplying)}
            >
              <MdReply className="w-4 h-4" />
              {isEditing ? (
                <span className="sr-only">
                  Annuler la réponse au commentaire
                </span>
              ) : (
                <span className="sr-only">Répondre au commentaire</span>
              )}
            </button>
          ) : null}
          {user && comment.authorId === userId ? (
            <>
              <button
                type="button"
                className="p-1 text-xs font-bold border border-transparent border-dashed hover:border-black"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <MdEditOff className="w-4 h-4" />
                ) : (
                  <MdEdit className="w-4 h-4" />
                )}
                {isEditing ? (
                  <span className="sr-only">Annuler la modification</span>
                ) : (
                  <span className="sr-only">Modifier</span>
                )}
              </button>
              <PopperMenu
                buttonChildren={({ open }) => (
                  <div
                    className={classNames(
                      "p-1 text-xs font-bold border",
                      open
                        ? "border-red text-red"
                        : "hover:border-black border-transparent border-dashed"
                    )}
                  >
                    <MdDelete className="w-4 h-4" />
                    <span className="sr-only">Supprimer</span>
                  </div>
                )}
                popperOptions={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 6],
                      },
                    },
                  ],
                }}
              >
                {({ open }) => (
                  <div className="flex flex-col max-w-[16rem] p-2 text-sm bg-white border border-black shadow-lg gap-y-1">
                    <p>Êtes-vous sûr de vouloir supprimer ce commentaire ?</p>
                    <div className="mt-2 ml-auto">
                      <button
                        className="border-b btn-red"
                        onClick={async () => {
                          let toastId = toast.loading(
                            "Suppression en cours...",
                            toastStyle
                          );
                          const result = await deleteComment({
                            commentId: comment.id,
                          });
                          if (result) {
                            setCommentList(result);
                            toast.success("Commentaire supprimé 👍", {
                              id: toastId,
                            });
                          } else {
                            toast.error("Une erreur est survenue 😖", {
                              id: toastId,
                            });
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </PopperMenu>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
