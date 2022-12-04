import toast from "react-hot-toast";

import { Image, ImageUploadForm } from "@/components/Profile/ImageUpload/Form";
import { deleteImage, uploadImage } from "@/lib/fetchers";
import toastStyle from "@/resources/toast.config";
import { useState } from "react";
import { ExtendedUser } from "@/types/User";

type ImageUploadSectionProps = {
  user: ExtendedUser;
};
export const ImageUploadSection = ({ user }: ImageUploadSectionProps) => {
  const [image, setImageState] = useState<Image | null>(
    user.image
      ? {
          src: user.image,
          alt: user.name || "Profile picture",
        }
      : null
  );
  const setImage = (imageUrl: string | null) => {
    if (imageUrl !== null)
      setImageState({
        src: imageUrl,
        alt: user.name || "Profile picture",
      });
    else setImageState(null);
  };

  const upload = async (image: string | null) => {
    if (!image) return;

    let toastId;
    try {
      toastId = toast.loading("Mise à jour de votre photo... 🫥", toastStyle);
      const url = await uploadImage(image);
      if (url) setImage(url);

      toast.success("Mise à jour réussie! 🥳", { id: toastId });
    } catch (e) {
      toast.error("Unable to upload", { id: toastId });
      setImage(null);
    }
  };

  const remove = async () => {
    if (!image) return;
    let toastId;
    try {
      toastId = toast.loading("Suppression de votre photo... 🫥", toastStyle);
      const result = await deleteImage();
      if (result) setImage(null);

      toast.success("Suppression réussie! 🥳", { id: toastId });
    } catch (e) {
      toast.error("Unable to delete", { id: toastId });
      setImage(null);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48" id="avatar">
      <h3 className="text-xl font-bold">Changement de photo de profil</h3>
      <ImageUploadForm
        initialImage={image}
        onChangeImage={upload}
        deleteImage={remove}
      />
    </div>
  );
};
