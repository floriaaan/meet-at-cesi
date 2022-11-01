import type { GetServerSideProps, NextPage } from "next";

import Link from "next/link";
import { getSession } from "next-auth/react";
import { MdChevronLeft, MdDelete } from "react-icons/md";

import prisma from "@/lib/prisma";
import type { ExtendedEvent } from "@/types/Event";
import { EventForm, EventFormValues } from "@/components/Event/Form";
import { AppLayout } from "@/components/Layout/AppLayout";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Fragment, useState } from "react";

type Props = {
  event: ExtendedEvent;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { id } = context.params as { id: string };

  let event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      participants: true,
    },
  });
  event = JSON.parse(JSON.stringify(event));

  if (!event || event.creator.email !== session?.user?.email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { event },
  };
};

const EventCreatePage: NextPage<Props> = ({ event }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsDeleteModalOpen(false);
  const openModal = () => setIsDeleteModalOpen(true);

  return (
    <AppLayout>
      <section className="flex flex-col items-start w-full h-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-8">
        <div className="inline-flex items-center justify-between w-full -mb-8 gap-x-2 md:px-2">
          <Link href={`/event/${event.id}`}>
            <a className="pl-2 pr-4 btn-black w-fit hover:border-transparent">
              <MdChevronLeft className="w-4 h-4 mr-0.5 shrink-0" />
              Retour
            </a>
          </Link>

          <button
            onClick={openModal}
            className="pl-3 pr-4 btn-red w-fit hover:border-transparent"
          >
            <MdDelete className="w-4 h-4 mr-0.5 shrink-0" />
            Supprimer
          </button>
        </div>
        <HeroTitle text="Modifier un événement" />
        <EventForm
          isEditing
          initialValues={
            {
              title: event.title,
              audience: event.audience,
              "audience-campus": event.audienceCampus,
              date: new Date(event.date)
                .toISOString()
                .split("T")[0] as unknown as Date,
              location: event.location,
            } as EventFormValues
          }
          onSubmit={async (values: EventFormValues) => {
            try {
              const res = await fetch(`/api/event/edit`, {
                body: JSON.stringify({ ...values, id: event.id }),
                method: "PUT",
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
      <section>
        <MyModal
          event={event}
          isOpen={isDeleteModalOpen}
          closeModal={closeModal}
        />
      </section>
    </AppLayout>
  );
};

export default EventCreatePage;

import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

import toastProps from "@/resources/toast.config";
import { deleteEvent } from "@/lib/fetchers";

export const MyModal = ({
  event,
  isOpen = false,
  closeModal,
}: {
  event: ExtendedEvent;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    try {
      let toastId = toast.loading("Suppression de l'événement...", toastProps);
      const result = await deleteEvent(event.id);
      if (result) {
        toast.success("Événement supprimé 👍", { id: toastId });
        closeModal();
        router.push("/event");
      } else toast.error("Une erreur est survenue... 😣", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Une erreur est survenue... 😣", toastProps);
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl ">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-black"
                >
                  {`Supprimer l'événement: ${event.title}`}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm whitespace-pre">
                    Êtes-vous sûr de vouloir supprimer cet événement ?
                    <br />
                    Cette action est irréversible.
                  </p>
                </div>

                <div className="inline-flex justify-end w-full mt-4 gap-x-2">
                  <button
                    className="border btn-red hover:border"
                    onClick={handleDelete}
                  >
                    Confirmer
                  </button>
                  <button
                    type="button"
                    className="w-1/5 border btn-black hover:border"
                    onClick={closeModal}
                  >
                    Annuler
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
