import type { NextPage } from "next";
import Image from "next/image";

import campusList from "@/resources/campus-list";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Searchbar } from "@/components/UI/Searchbar";

/**
 * TODO: refactor this page for better splitting components
 */
const Home: NextPage = () => {
  return (
    <AppLayout>
      <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[75vh]">
        <Image
          priority={false}
          src={"/img/hero.avif"}
          alt="Hero image"
          width={1920}
          height={1080}
          className="absolute top-0 left-0 object-cover w-full h-full"
        />

        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-b from-transparent to-black" />
      </section>

      <div className="relative flex flex-col items-start w-full h-full px-4 mx-auto md:px-12 xl:px-0 xl:max-w-6xl gap-y-8 -top-80">
        <h1 className="text-7xl title">Petite bière ? 🍻</h1>
        <div className="flex flex-col w-full">
          <div className="flex flex-col items-center w-full px-4 pt-4 pb-6 bg-purple gap-y-4 lg:gap-y-0 lg:flex-row xl:pb-4 ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex flex-col w-full px-4"
            >
              <Searchbar className="input__shadow-purple" />
            </form>

          </div>
          <div className="w-full px-8 py-6 bg-white shadow-2xl font-body">
            <span className="pb-2 pr-2 bg-white">
              Découvrez les évenements organisés par des étudiant.e.s CESI
            </span>
            <div className="flex flex-wrap p-6 -mt-3 border border-black gap-x-2 gap-y-3 md:gap-4">
              {campusList.sort().map((campus) => (
                <a className="btn__pill" key={campus.value}>
                  {campus.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
