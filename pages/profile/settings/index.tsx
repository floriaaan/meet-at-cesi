import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { NextSeo } from "next-seo";
import toast from "react-hot-toast";

import prisma from "@/lib/prisma";
import toastStyle from "@/resources/toast.config";
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

  let user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    include: { preferences: true },
  });

  user = JSON.parse(JSON.stringify(user));
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

  const [preferences, setPreferences] = useState<ExtendedUser["preferences"]>(
    user.preferences || undefined
  );
  return (
    <AppLayout>
      <ProfileLayout>
        <NextSeo noindex title="Paramètres" />
        <section className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4">
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
            <PreferencesSection
              preferences={preferences}
              setPreferences={setPreferences}
            />
          </div>
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;

const PreferencesSection = ({
  preferences,
  setPreferences,
}: {
  preferences: ExtendedUser["preferences"];
  setPreferences: (preferences: ExtendedUser["preferences"]) => void;
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
          return editPreferences({ campus, promotion, promotionYear }).then(
            (result) => {
              if (result && !(result instanceof Error)) {
                setPreferences(result.user.preferences);
              }
              return Promise.resolve(result);
            }
          );
        }}
        initialValues={
          {
            campus: preferences?.campus || "",
            promotion: preferences?.promotion?.split(":")[0] || "",
            promotionYear: preferences?.promotion?.split(":")[1] || "",
          } as PreferencesFormValues
        }
        optionalButton={
          preferences ? (
            <button
              type="button"
              onClick={async () => {
                return editPreferences({
                  campus: "",
                  promotion: "",
                  promotionYear: "",
                }).then((result) => {
                  if (result && !(result instanceof Error)) {
                    setPreferences(result.user.preferences);
                  }
                  return Promise.resolve(result);
                });
              }}
              className="inline-flex items-center gap-1 mb-2 text-xs text-red hover:underline underline-offset-2 decoration-red w-fit"
            >
              <MdDelete />
              Supprimer tout
            </button>
          ) : undefined
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
