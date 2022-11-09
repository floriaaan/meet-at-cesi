import classNames from "classnames";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdChevronRight, MdUploadFile } from "react-icons/md";

export type Image = {
  src: string;
  alt: string;
};

type ImageUploadFormProps = {
  initialImage?: Image | null;
  onChangePicture: (image: string | null) => Promise<void>;

  sizeLimit?: number;
  accept?: string;
};
export const ImageUploadForm = ({
  initialImage = null,
  onChangePicture,

  accept = ".png, .jpg, .jpeg, .gif",
  sizeLimit = 10 * 1024 * 1024, // 10MB
}: ImageUploadFormProps) => {
  const pictureRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<Image | null>(initialImage);
  const [updatingPicture, setUpdatingPicture] = useState<boolean>(false);
  const [pictureError, setPictureError] = useState<string | null>(null);

  const handleOnChangePicture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    const reader = new FileReader();

    const fileName = file?.name?.split(".")?.[0] ?? "New file";

    reader.addEventListener(
      "load",
      async function () {
        try {
          setImage({ src: reader.result?.toString() || "", alt: fileName });
          if (typeof onChangePicture === "function") {
            await onChangePicture(reader.result?.toString() || null);
          }
        } catch (err) {
          toast.error("Unable to update image");
        } finally {
          setUpdatingPicture(false);
        }
      },
      false
    );

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingPicture(true);
        setPictureError("");
        reader.readAsDataURL(file);
      } else {
        setPictureError("File size is exceeding 10MB.");
      }
    }
  };

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      (pictureRef.current as { click: () => void })?.click();
    }
  };
  return (
    <div className="flex flex-col space-y-2">
      <label className="font-bold text-black font-body">
        {"Téléversement d'une nouvelle photo de profil"}
      </label>

      <div className="inline-flex items-center">
        <button
          disabled={updatingPicture}
          onClick={handleOnClickPicture}
          className={classNames(
            "relative aspect-square w-32 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition group focus:outline-none",
            image?.src
              ? "hover:opacity-50 disabled:hover:opacity-100"
              : "border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200"
          )}
        >
          {image?.src ? (
            <Image
              src={image.src}
              alt={image?.alt ?? ""}
              fill
              className="w-full h-full aspect-square"
            />
          ) : null}

          <div className="flex items-center justify-center">
            {!image?.src ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-2 transition bg-gray-200 rounded-full shrink-0 group-hover:scale-110 group-focus:scale-110">
                  <MdUploadFile className="w-4 h-4 text-gray-500 transition" />
                </div>
                <span className="text-xs font-semibold text-gray-500 transition">
                  {updatingPicture ? "Uploading..." : "Upload"}
                </span>
              </div>
            ) : null}
            <input
              ref={pictureRef}
              type="file"
              accept={accept}
              onChange={handleOnChangePicture}
              className="hidden"
            />
          </div>
        </button>
      </div>

      {pictureError ? (
        <span className="text-sm text-red-600">{pictureError}</span>
      ) : null}
    </div>
  );
};
