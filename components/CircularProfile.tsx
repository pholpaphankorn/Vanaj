export function CircularProfile(props: { active: Boolean, size: string}){
    const pictureSize = props.size;
    const statusSize= props.size==="8"?"2":"3";
    console.log(pictureSize, statusSize,"hey")
    return (
        <div className="relative inline-flex">
        {props.active?<span
          className={`absolute bottom-0 right-2 h-${statusSize} w-${statusSize} rounded-full bg-green-600 dark:border-slate-900 dark:bg-green-600 dark:text-slate-100`}
        ></span>:null}
        <img
          className={`mr-2 h-${pictureSize} w-${pictureSize} rounded-full`}
          src="https://i.kym-cdn.com/entries/icons/original/000/018/166/pakalu.png"
        />
      </div>
    );
}
