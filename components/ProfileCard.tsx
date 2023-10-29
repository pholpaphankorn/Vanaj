import { CircularProfile } from "@/components/CircularProfile";
export function ProfileCard(props: { active: Boolean }) {
    return (
        <div
            className="w-full max-w-sm rounded-lg py-2 ml-1"
        >
            <div className="flex items-center">
                <div className="flex ">
                    <CircularProfile active={true} type="profile"/>

                    <div className="ml-2 flex flex-col 2gap-y-">
                        <h3 className="vanaj-name-txt font-bold text-black">
                            Vanaj
                        </h3>
                        <span className="status-txt text-slate-400">Active Now</span>

                    </div>
                    
                </div>
            </div>

        </div>
    );
}