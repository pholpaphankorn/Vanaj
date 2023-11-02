export function CircularProfile(props: { active: Boolean, type?: string,handleLoad?:any,imgRef?:any}){

    return (
        <div className={`relative inline-flex shrink-0 ${props.type=='profile'?"self-center":""}`}>
        {props.active?<span
          className={`status-${props.type}-size ${props.type=='profile'?"border-fs-red":"border-fs-green"} border border-2 w-3 h-3 absolute rounded-full bg-green-600 dark:bg-green-600 dark:text-slate-100`}
        ></span>:null}
        <img
          ref={props.imgRef}
          className={`image-${props.type}-size mr-2 rounded-full `}
          src="/images/vanaj.jpg"
          onLoad={props.handleLoad}
        />
      </div>
    );
}
