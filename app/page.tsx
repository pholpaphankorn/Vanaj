
"use client";
import { Navbar } from "@/components/Navbar";
import Router, { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  return (
    <div>
      <Navbar chat={false} />
      <div class="relative" id="home">
        <div aria-hidden="true" class="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div class="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
          <div class="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
        </div>
        <div>
          <div class="relative pt-36 ml-auto">
            <div class="lg:w-2/3 text-center mx-auto">
              <h1 class="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">Ask me anything about <span class="text-primary dark:text-white">Paphankorn.</span></h1>
              <p class="mt-8 text-gray-700 dark:text-gray-300">
                Hi, I&apos;m Vanaj and I come from India. I&apos;m a close friend of Paphankorn Tanaroj. This guy is so amazing and I&apos;m here to answer any questions you might have.
                In case you don't know, ChatGPT is my cousin.
              </p>

              <div class="mt-16 mb-16 flex flex-wrap justify-center gap-y-4 gap-x-6">

                <button
                  onClick={() => router.push('/chat')}
                  class="hover:bg-gray-700 relative flex h-11 items-center justify-center px-6 before:absolute before:inset-0 rounded-full  before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 active:duration-75 active:before:scale-95 dark:bg-gray-800 sm:w-max"
                >
                  <span
                    class="relative text-base font-semibold text-primary dark:text-white"
                  >Get started
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
}


