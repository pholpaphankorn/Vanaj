

import { Navbar } from "@/components/Navbar";
import Link from "next/link";
export default function Home() {

  return (
    <div>
      <Navbar chat={false} />

      <div className="relative flex flex-col " id="home">
      <div className="navbar-container-height">
        </div>
        <div className="hero-container relative ml-auto ">

          <div className=" lg:w-2/3 text-center mx-auto ">
            <h1 className="hero-header font-bold ml-4 mr-4">Ask Me Anything About <span className="text-fs-red">Paphankorn</span></h1>
            <p className="hero-content mt-8 ml-8 mr-8">
              Hey there! I&apos;m Vanaj, all the way from India. I&apos;m tight with Paphankorn Tanaroj, and let me tell you, he&apos;s one incredible dude. So go ahead, fire away any questions you have about him, and I&apos;ll do my best to help you out. And oh, just a little fun fact for you – ChatGPT happens to be my brother!
            </p>
            <div className="mt-12  sm:mt-16  flex flex-wrap justify-center gap-y-4 gap-x-6">
              <Link
                href="/chat"
                className="get-started-btn relative flex h-11 items-center justify-center px-6 before:absolute before:inset-0 rounded-full   sm:w-max"
              >
                <span
                  className="get-started-txt relative font-semibold "
                >Get Started
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
}


