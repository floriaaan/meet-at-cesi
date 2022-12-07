import { useState } from "react";
import { useRouter } from "next/router";

import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { ExtendedFeedback } from "@/types/Feedback";
import { FeedbackTableModal } from "@/components/Admin/CustomTable/Feedback/Modal";
import routes from "@/resources/routes";
import { formatDate } from "@/lib/date";

export const FeedbackTableItem = (props: ExtendedFeedback) => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(id === props.id);
  const openModal = () => {
    setIsModalOpen(true);
    router.push(`/admin/feedback?id=${props.id}`, undefined, { shallow: true });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    router.push(`/admin/feedback`, undefined, { shallow: true });
  };

  const { createdAt, history, page, text, user } = props;
  return (
    <>
      <tr
        className="w-full text-black bg-white cursor-pointer hover:bg-neutral-100"
        onClick={openModal}
      >
        <td className="max-w-[16rem] px-6 py-4 truncate">{text}</td>
        <td className="px-6">
          <AvatarWithName
            user={user}
            avatarClassName="w-6 h-6 text-xs"
            textClassName="text-[0.75rem] font-bold"
            direction="row"
          />
        </td>
        <td className="px-6">{routes[page as keyof typeof routes]}</td>
        <td className="px-6">
          {history.length > 0 ? "Oui" : "Non"} ({history.length})
        </td>
        <td className="px-6">{formatDate(createdAt)}</td>
      </tr>
      <FeedbackTableModal
        {...props}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  );
};
