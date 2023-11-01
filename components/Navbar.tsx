"use client";
import { ProfileCard } from "@/components/ProfileCard";
export function Navbar(props: { chat: Boolean ,handleLoad:any,display:string,imgRef:any}) {

  return (

<nav className={`fixed w-full z-20 ${props.display} `}>
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
    <div className="relative flex navbar-container-height items-center justify-between">
    {props.chat ? <ProfileCard active={true} handleLoad={props.handleLoad} imgRef={props.imgRef}/> :
<h3 className="vanaj-logo-txt font-bold text-black ml-1">
   Vanaj
</h3>}
    </div>
  </div>
</nav>

  );
}




// }
