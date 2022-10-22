import type { NextPage } from "next";
import Image from "next/future/image";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Navbar } from "../components/Layout/Navbar";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main>
        <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] xl:h-[90vh]">
          <Image
            src={"/img/hero.avif"}
            alt="Hero image"
            width={1920}
            height={1080}
            className="absolute top-0 left-0 object-cover w-full h-full"
          />

          <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-b from-transparent to-black" />
        </section>

        <div className="relative flex flex-col items-start w-full h-full px-8 text-center gap-y-8 -top-48">
          <h1 className="title">Bienvenue sur Meet at CESI…</h1>
          <div className="flex flex-col w-full">
            <div className="w-full bg-purple inline-flex items-center divide-x py-4 divide-[#94919c]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex flex-col w-1/2 px-4"
              >
                <label
                  htmlFor="search"
                  className="mr-auto font-bold text-black font-body"
                >
                  {"Trouvez l'événement qui vous correspond"}
                </label>
                <div className="relative inline-flex w-full py-3 ">
                  <HiMagnifyingGlass className="absolute pointer-events-none w-6 h-6 m-2 stroke-[1.25] top-4 left-2 text-purple" />
                  <input
                    id="search"
                    type="text"
                    className="py-3 pl-12 pr-6 text-sm rounded-l-full grow placeholder:italic"
                    placeholder="Rechercher un événement..."
                  />
                  <button
                    type="submit"
                    className="py-3 pl-6 pr-8 font-bold border border-black rounded-r-full font-body shrink-0 bg-primary"
                  >
                    GO
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
