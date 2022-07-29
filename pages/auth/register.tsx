import { Input } from "@material-tailwind/react";
import { AppLayout } from "components/Layout/AppLayout";
import { Button } from "components/UI/Button/Button";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";

const Register: NextPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  const previous = () => setStep(1);
  const next = () => {
    if (true) {
      setStep(2);
    }
  };
  const submit = () => {
    if (true) {
      router.push("/");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col justify-between h-[95vh] pt-6 pb-12">
        <div className="flex flex-col">
          <Link href="/welcome">
            <a className="inline-flex items-center">
              <motion.img
                layoutId={`logos:cesi`}
                src="/static/logos/cesi.svg"
                alt="CESI"
                width={32}
                height={32}
              />
              <motion.img
                layoutId={`logos:meet-text`}
                src="/static/logos/meet-text.svg"
                alt="CESI"
                width={24 * 4}
                height={24}
                className="ml-4 -mt-1"
              />
            </a>
          </Link>

          <div className="relative h-[259px] w-[275px] mx-auto">
            <motion.img
              //   layoutId={`illustrations:0`}
              src="/static/illustrations/welcome.svg"
              alt="Welcome"
              className="absolute top-0 right-2"
              width={150}
              height={150}
              animate={{
                translateY: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.img
              layoutId={`illustrations:1`}
              src="/static/illustrations/1.svg"
              alt="Welcome"
              className="absolute left-0 z-10 bottom-4"
              width={175}
              height={175}
              animate={{
                translateY: [0, -10, 0],
              }}
              transition={{
                duration: 9.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.img
              layoutId={`illustrations:2`}
              src="/static/illustrations/2.svg"
              alt="Welcome"
              className="absolute bottom-0 right-0"
              width={125}
              height={125}
              animate={{
                translateY: [0, -10, 0],
              }}
              transition={{
                duration: 6.66,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>

          <div className="flex flex-col gap-4 my-4">
            <h3 className="my-2 text-2xl font-bold text-secondary font-heading">
              {"S'inscrire"}
            </h3>
            {step === 1 && (
              <>
                <Input
                  label="Adresse e-mail"
                  type="email"
                  color="amber"
                  size="lg"
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  color="amber"
                  size="lg"
                />
                <Input
                  label="Confirmation du mot de passe"
                  type="password"
                  color="amber"
                  size="lg"
                />
                <Button
                  className="w-full"
                  padding="py-3"
                  variant="tertiary"
                  size="medium"
                  onClick={next}
                >
                  Suivant
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label="Nom complet"
                  type="text"
                  color="amber"
                  size="lg"
                />
                <Input
                  label="Date de naissance"
                  type="date"
                  color="amber"
                  size="lg"
                />
                <Input
                  label="Promotion CESI"
                  type="text"
                  color="amber"
                  size="lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="w-full"
                    padding="py-3"
                    variant="tertiary"
                    size="medium"
                    onClick={previous}
                  >
                    Retour
                  </Button>
                  <Button
                    className="w-full"
                    padding="py-3"
                    variant="tertiary"
                    size="medium"
                    onClick={submit}
                  >
                    Suivant
                  </Button>
                </div>
              </>
            )}
            <p className="text-xs text-center">
              {"Vous avez déjà un compte ?"}
              <Link href="/auth/login">
                <a className="ml-1 font-semibold text-primary-800">
                  {"Se connecter"}
                </a>
              </Link>
            </p>
          </div>
        </div>

        <Button className="w-full" variant="primary" size="large">
          <div className="inline-flex items-center">
            <Image
              src="/static/logos/cesi.svg"
              alt="CESI"
              width={16}
              height={16}
            />
            <span className="ml-2">Connexion avec viacesi</span>
          </div>
        </Button>
      </div>
    </AppLayout>
  );
};

export default Register;
