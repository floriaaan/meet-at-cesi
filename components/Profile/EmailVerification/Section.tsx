import toast from "react-hot-toast";
import { MdVerified } from "react-icons/md";

import { ExtendedUser } from "@/types/User";
import toastStyle from "@/resources/toast.config";
import { useState } from "react";
import { sendVerificationEmail } from "@/lib/fetchers";

type EmailVerificationSectionProps = {
  user: ExtendedUser;
};

export const EmailVerificationSection = ({
  user,
}: EmailVerificationSectionProps) => {
  const [disabled, setDisabled] = useState(false);
  const handleVerifyEmail = async () => {
    let toastId = toast.loading("Envoi du mail de vérification...", toastStyle);
    setDisabled(true);
    try {
      const result = await sendVerificationEmail();
      if (result) {
        toast.success("Mail de vérification envoyé !", { id: toastId });
      } else {
        toast.error("Une erreur est survenue", { id: toastId });
      }
    } catch (error) {
      toast.error("Une erreur est survenue...", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div
      className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48"
      id="email-verification"
    >
      <h3 className="text-xl font-bold">Vérification de votre adresse email</h3>
      <p className="text-sm text-gray-700 whitespace-pre-line">
        {user.emailVerified
          ? "Votre adresse email est vérifiée."
          : "Avoir une adresse email vérifiée peut être rassurant pour certains utilisateurs."}
      </p>
      <div className="mt-4 ">
        <button
          disabled={disabled}
          type="button"
          onClick={handleVerifyEmail}
          className="border-b btn-black w-fit gap-x-1"
        >
          {user.emailVerified ? (
            <MdVerified className="w-4 h-4 shrink-0" />
          ) : null}
          {user.emailVerified ? "Vérifié" : "Vérifier"}
        </button>
      </div>
    </div>
  );
};
