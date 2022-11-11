import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";

import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";
import { HeroTitle } from "@/components/UI/HeroTitle";
import {
  PreferencesForm,
  PreferencesFormValues,
} from "@/components/Profile/PreferencesForm";
import { ExtendedUser } from "@/types/User";
import { deleteImage, editPreferences, uploadImage } from "@/lib/fetchers";
import { Image, ImageUploadForm } from "@/components/Profile/ImageUploadForm";
import { useState } from "react";
import toast from "react-hot-toast";
import toastStyle from "@/resources/toast.config";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session || !session.user?.email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    include: { preferences: true },
  });
  return {
    props: { user },
  };
}

type Props = {
  user: ExtendedUser;
};

const ProfileSettingsPage: NextPage<Props> = ({ user }) => {
  const [image, setImage] = useState<Image | null>(
    user.image
      ? {
          src: user.image,
          alt: user.name || "Profile picture",
        }
      : null
  );
  return (
    <AppLayout>
      <ProfileLayout>
        <section className="flex flex-col items-start w-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4">
          <HeroTitle text="Paramètres" />
          <div className="flex flex-col w-full divide-y">
            <ImageUploadSection
              image={image}
              setImage={(imageUrl: string | null) => {
                if (imageUrl !== null)
                  setImage({
                    src: imageUrl,
                    alt: user.name || "Profile picture",
                  });
                else setImage(null);
              }}
            />
            <PreferencesSection preferences={user.preferences} />
          </div>
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;

const PreferencesSection = ({
  preferences,
}: {
  preferences: ExtendedUser["preferences"];
}) => {
  return (
    <div
      className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48"
      id="preferences"
    >
      <h3 className="text-xl font-bold">
        Sélection du campus et de la promotion
      </h3>
      <p className="text-sm text-gray-700 whitespace-pre-line">
        {
          "Pour l'instant, il n'est pas possible de sélectionner plusieurs promotions.\n"
        }
        Merci de sélectionner la promotion la plus récente.
      </p>
      <PreferencesForm
        onSubmit={async ({ campus, promotion, promotionYear }) => {
          return editPreferences({ campus, promotion, promotionYear });
        }}
        initialValues={
          {
            campus: preferences?.campus || "",
            promotion: preferences?.promotion?.split(":")[0] || "",
            promotionYear: preferences?.promotion?.split(":")[1] || "",
          } as PreferencesFormValues
        }
      />
    </div>
  );
};

type ImageUploadSectionProps = {
  image: Image | null;
  setImage: (image: string | null) => void;
};
const ImageUploadSection = ({ image, setImage }: ImageUploadSectionProps) => {
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
      console.log(result);
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
