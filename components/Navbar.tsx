"use client";
import {ProfileCard} from "@/components/ProfileCard";
export function Navbar() {

  return (
<>
<nav className="bg-white dark:bg-white fixed w-full z-20 top-0 left-0 ">

  <div className="max-w-screen-xl flex justify-center mx-auto">
      <ProfileCard active={true}/>
  </div>
</nav>
</>

  );
}

