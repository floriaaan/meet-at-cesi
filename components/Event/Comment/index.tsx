import { ReportObject, ReportType } from "@prisma/client";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdDelete,
  MdEdit,
  MdEditOff,
  MdReply,
  MdWarning
} from "react-icons/md";

import {
  CommentForm,
  CommentFormValues
} from "@/components/Event/Comment/Form";
import { ReplyList } from "@/components/Event/Comment/ReplyList";
import PopperMenu from "@/components/Helpers/PopperMenu";
import { useReport } from "@/components/Report/Wrapper";
import { Avatar } from "@/components/UI/Avatar";
import { formatDate, formatRelative } from "@/lib/date";
import { createComment, deleteComment, editComment } from "@/lib/fetchers";
import toastStyle from "@/resources/toast.config";
import { ExtendedComment } from "@/types/Event";
import { ExtendedSession } from "@/types/Session";

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
  const { user } = (session as ExtendedSession) || {};
  const { id: userId } = user || {};
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { openReportModal } = useReport();
  const { content, author, children, createdAt, id, deletedAt } = comment;
  const isDeleted = deletedAt !== null;

  return (
    <div
      className="inline-flex items-start w-full gap-1 p-1 overflow-hidden duration-300 border border-dashed md:gap-2 md:p-2 hover:border-gray-300"
      id={id}
    >
      <Avatar
        className={classNames(
          !isReply ? "lg:w-12 lg:h-12 w-6 h-6 " : "w-6 h-6 lg:w-8 lg:h-8",
          !isDeleted && "lg:border-2"
        )}
        user={author || { name: "?" }}
        link={author?.id !== undefined}
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
          </div>
        </div>

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
          ) : null}
          {!isDeleted && userId !== author.id ? (
            <button
              type="button"
              className="p-1 text-xs font-bold border border-transparent border-dashed hover:border-black"
              onClick={() =>
                openReportModal({
                  content: "",
                  page: `/event/${comment.eventId}/`,
                  object: ReportObject.COMMENT,
                  objectId: comment.id,
                  type: ReportType.OTHER,
                })
              }
            >
              <MdWarning className="w-4 h-4" />
            </button>
          ) : null}
          {user && comment.authorId === userId ? (
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
                <div className="flex flex-col max-w-[16rem] p-2 text-sm bg-neutral-100 border border-black border-dashed shadow-lg gap-y-1">
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
          ) : null}
        </div>
      </div>
    </div>
  );
};
