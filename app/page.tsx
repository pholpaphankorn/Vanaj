

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
export default function Home() {

  return (
    <div>
      <Navbar chat={false} />
      <div className="relative" id="home">
        <div>
          <div className="relative pt-24 sm:pt-36 ml-auto">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="hero-header font-bold ml-4 mr-4">Ask me anything about Paphankorn</h1>
              <p className="hero-content mt-8 ml-8 mr-8">
                Hi, I&apos;m Vanaj and I come from India. I&apos;m a close friend of Paphankorn Tanaroj. This guy is so amazing and I&apos;m here to answer any questions you might have.
                In case you don&apos;t know, ChatGPT is my cousin.
              </p>

              <div className="mt-12 mb-12 sm:mt-16 sm:mb-16 flex flex-wrap justify-center gap-y-4 gap-x-6">

                <Link
                  href="/chat"
                  className="get-started-btn relative flex h-11 items-center justify-center px-6 before:absolute before:inset-0 rounded-full   sm:w-max"
                >
                  <span
                    className="get-started-txt relative font-semibold "
                  >Get started
                  </span>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
}


