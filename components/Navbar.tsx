"use client";
import { ProfileCard } from "@/components/ProfileCard";
export function Navbar(props: { chat: Boolean }) {

  return (

<nav className="bg-white fixed w-full z-20">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
    <div className="relative flex h-16 items-center justify-between">
    {props.chat ? <ProfileCard active={true} /> :
<h3 className="text-xl font-bold text-black">
   Vanaj
</h3>}
    </div>
  </div>
</nav>

  );
}




// }
