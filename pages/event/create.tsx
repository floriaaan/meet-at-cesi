import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";

import { EventForm, EventFormValues } from "@/components/Event/Form";
import { AppLayout } from "@/components/Layout/AppLayout";
import { HeroTitle } from "@/components/UI/HeroTitle";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

const EventCreatePage: NextPage = () => {
  return (
    <AppLayout>
      <section className="flex flex-col items-start h-auto px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-8">
        <HeroTitle text="Organiser un événement" />
        <EventForm
          onSubmit={async (values: EventFormValues) => {
            try {
              const res = await fetch("/api/event", {
                body: JSON.stringify(values),
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              if (res.ok && res.status === 201) return await res.json();
              else return false;
            } catch (error) {
              console.error(error);
              return await Promise.reject(error);
            }
          }}
        />
      </section>
    </AppLayout>
  );
};

export default EventCreatePage;
