import { AppLayout } from "components/Layout/AppLayout";
import { Button } from "components/UI/Button/Button";
import { motion } from "framer-motion";
import type { NextPage } from "next";

const Welcome: NextPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-around h-[95vh] pt-6 pb-12">
        <div className="">
          <motion.img
            layoutId={`logos:cesi`}
            src="/static/logos/cesi.svg"
            alt="CESI"
            width={64}
            height={64}
          />
        </div>
        <div className="">
          <motion.img
            layoutId={`logos:meet-text`}
            src="/static/logos/meet-text.svg"
            alt="CESI"
            width={48 * 4}
            height={48}
          />
        </div>
        <div className="">
          <motion.img
            layoutId={`illustrations:0`}
            src="/static/illustrations/welcome.svg"
            alt="Welcome"
            width={256}
            height={256}
            animate={{
              translateY: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
        <p className="text-sm text-center text-secondary">
          Logoden biniou degemer mat an penn ar bed anezhi, hep c’hazh glac’har
          ha ezhomm kasoni diwall brumenn Sant-Nouga.
        </p>
        <Button
          href="/auth/login"
          className="w-full"
          variant="tertiary"
          size="large"
        >
          Suivant
        </Button>
      </div>
    </AppLayout>
  );
};

export default Welcome;

/* TODO: getServerSideProps to redirect:
    * - to / if user is logged in
    * - to /auth/login if not and not first visit

*/
