export function CircularProfile(props: { active: Boolean, size: string}){
    const pictureSize = props.size;
    const statusSize= props.size==="8"?"2":"3";
    console.log(pictureSize, statusSize,"hey")
    return (
        <div className="relative inline-flex shrink-0">
        {props.active?<span
          className={`absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-600 dark:border-slate-900 dark:bg-green-600 dark:text-slate-100`}
        ></span>:null}
        <img
          className={`mr-2 h-${pictureSize} w-${pictureSize} rounded-full `}
          src="https://source.unsplash.com/40x40/?portrait"
        />
      </div>
    );
}
