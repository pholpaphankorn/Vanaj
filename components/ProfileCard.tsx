import { CircularProfile } from "@/components/CircularProfile";
export function ProfileCard(props: { active: Boolean }) {
    return (
        <div
            className="w-full max-w-sm rounded-lg py-2"
        >
            <div className="flex items-center">
                <div className="flex">
                    <CircularProfile active={true} size="10"/>

                    <div className="ml-2 flex flex-col 2gap-y-">
                        <h3 className="text-xl font-bold text-black">
                            Vanaj
                        </h3>
                        <span className="text-xs text-slate-400">Active Now</span>

                    </div>
                    
                </div>
                {/* <span
      className="rounded-full text-xs bg-green-600/10 px-2.5 py-1  font-semibold leading-5 text-green-600"
    >
      Active Now
    </span> */}
            </div>

        </div>
    );
}