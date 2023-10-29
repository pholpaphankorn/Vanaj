import type { Message } from "ai/react";
import {CircularProfile} from "@/components/CircularProfile";

export function ChatMessageBubble(props: { message: Message, aiEmoji?: string, sources: any[] }) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    props.message.role === "user" ? "flex flex-row-reverse items-start" : "flex items-start";
  const styleClassName =
    props.message.role === "user" ? "flex rounded-b-xl rounded-tl-xl px-4  sm:min-h-0 sm:max-w-md md:max-w-2xl" : "flex rounded-b-xl rounded-tr-xl px-4 sm:max-w-md md:max-w-2xl";
  return (

    <div
      className="rounded py-1 sm:py-2"
    >
      <div className={alignmentClassName}>
        {props.message.role === "user" ? null :
            <CircularProfile active={true} type="chat"/>
        }
        <div
          className={`${styleClassName} ${colorClassName}`}
        >
          <p className="chat-message-txt whitespace-pre-line">{props.message.content}</p>
        </div>
      </div>
    </div>

  );
}

