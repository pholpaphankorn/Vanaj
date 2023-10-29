export function CircularProfile(props: { active: Boolean, type?: string}){

    return (
        <div className={`relative inline-flex shrink-0 ${props.type=='profile'?"self-center":""}`}>
        {props.active?<span
          className={`status-${props.type}-size  w-3 h-3 absolute rounded-full bg-green-600 dark:border-slate-900 dark:bg-green-600 dark:text-slate-100`}
        ></span>:null}
        <img
          className={`image-${props.type}-size mr-2 rounded-full `}
          src="https://source.unsplash.com/40x40/?portrait"
        />
      </div>
    );
}
