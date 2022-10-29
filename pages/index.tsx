import type { NextPage } from "next";
import Image from "next/future/image";
import { HiChevronDown, HiMagnifyingGlass } from "react-icons/hi2";

import { AppLayout } from "@/components/Layout/AppLayout";
import { campusList } from "@/resources/campus-list";

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
          <div className="w-full bg-purple px-4 flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row items-center pb-6 xl:pb-4 lg:divide-x pt-4 divide-[#94919c]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex flex-col w-full px-4 xl:w-1/2"
            >
              <label
                htmlFor="search"
                className="mr-auto font-bold text-black font-body"
              >
                {"Trouvez l'événement qui vous correspond"}
              </label>
              <div className="relative inline-flex w-full rounded-full input__shadow-purple">
                <HiMagnifyingGlass className="absolute pointer-events-none w-6 h-6 m-2 stroke-[1.25] top-1 left-2 text-purple" />
                <input
                  id="search"
                  type="text"
                  className="py-3 pl-12 pr-6 text-sm rounded-l-full grow placeholder:italic"
                  placeholder="Rechercher un événement..."
                />
                <button
                  type="submit"
                  className="py-3 pl-6 pr-8 font-bold rounded-r-full font-body shrink-0 btn__colors"
                >
                  GO
                </button>
              </div>
            </form>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex flex-col w-full px-4 xl:w-1/2"
            >
              <label
                htmlFor="user-type"
                className="mr-auto font-bold text-black font-body"
              >
                {"Laissez vous guider"}
              </label>
              <div className="relative w-full">
                <select
                  id="user-type"
                  className="w-full px-4 py-3 appearance-none input__shadow-purple"
                  defaultValue=""
                >
                  <option value="">Vous êtes en recherche de...</option>
                </select>
                <HiChevronDown className="absolute pointer-events-none w-6 h-6 m-2 stroke-[1.25] top-1 right-2 text-purple" />
              </div>
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
