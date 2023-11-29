import type { Message } from "ai/react";
import { CircularProfile } from "@/components/CircularProfile";
import Linkify from "linkify-react";

export function ChatMessageBubble(props: { message: Message}) {
  const colorClassName =
    props.message.role === "user" ? "chat-message-user-color" : "chat-message-vanaj-color ";
  const alignmentClassName =
    props.message.role === "user" ? "flex flex-row-reverse items-start" : "flex items-start";
  const styleClassName =
    props.message.role === "user" ? "flex rounded-b-xl rounded-tl-xl px-4  sm:min-h-0 sm:max-w-md md:max-w-2xl" : "flex rounded-b-xl rounded-tr-xl px-4 sm:max-w-md md:max-w-2xl";
  const linkClassName =
    props.message.role === "user" ? "text-white underline" : "underline text-blue-600 hover:text-blue-800";

  const options = {
    defaultProtocol: 'https',
    className: linkClassName
  };


  return (

    <div
      className="rounded py-1 sm:py-2"
    >
      <div className={alignmentClassName}>
        {props.message.role === "user" ? null :
          <CircularProfile active={true} type="chat" />
        }
        <div
          className={`${styleClassName} ${colorClassName}`}
        >
          <p className="chat-message-txt whitespace-pre-line">
            <Linkify options={options}>
              {props.message.content}
            </Linkify>
          </p>
        </div>
      </div>
    </div>

  );
}

