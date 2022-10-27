import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { EventForm, EventFormValues } from "../../components/Event/Form";
import { AppLayout } from "../../components/Layout/AppLayout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Check if user is authenticated
  const session = await getSession(context);

  // If not, redirect to the homepage
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
      <section className="flex flex-col items-start w-full h-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-8">
        <div className="w-full p-4 px-6 text-black bg-primary">
          <h1 className="text-[4rem] relative font-bold leading-none md:leading-normal font-heading before:block before:absolute before:-bottom-2 md:before:bottom-1 before:left-2 md:before:left-6 before:bg-white before:w-32 before:h-3">
            Organiser un événement
          </h1>
        </div>
        <EventForm
          onSubmit={async (values: EventFormValues) => {
            try {
              const res = await fetch("/api/event", {
                body: JSON.stringify(values),
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });
              if (res.ok && res.status === 201) return true;
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
