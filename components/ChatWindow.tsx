"use client";


import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, useEffect, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { IntermediateStep } from "./IntermediateStep";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea";

export function ChatWindow(props: {
  endpoint: string,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);
  const ingestForm = showIngestForm && <UploadDocumentsForm></UploadDocumentsForm>;
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)}></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onResponse(response) {
        const sourcesHeader = response.headers.get("x-sources");
        const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : [];
        const messageIndexHeader = response.headers.get("x-message-index");
        
      },
      onError: (e) => {
        // console.log(e)
      }
    });
  async function onEnter(e: any) {
    if (e.key === 'Enter' && !e.shiftKey) {
      await sendMessage(e);
    } 
  }
  async function sendMessage(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ) {
      return;
    }

    handleSubmit(e);
    // Some extra work to show intermediate steps properly
    // const newMessages = messages.concat({ id: messages.length.toString() + 'user', content: input, role: "user" });
    // const replyMessages = messages.concat({ id: messages.length.toString() + 'vanaj', content: input, role: "Vanaj" });
    // setMessages([...newMessages, ...replyMessages]);



  }
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);
  return (

    <div className={`chat-window flex flex-col items-center p-4 md:p-8 rounded grow mx-auto sm:max-w-5xl sm:px-4 p-4 md:p-12 min-h-[100vh] `}>
      <div
        className="flex w-full"
        ref={messageContainerRef}
      >
        <div
          className="flex flex-col-reverse w-full mt-16 mb-20 transition-[flex-grow] ease-in-out"
        >
          {messages.length > 0 ? (
            [...messages]
              .reverse()
              .map((m, i) => {
                const sourceKey = (messages.length - 1 - i).toString();
                return (
                  <ChatMessageBubble key={m.id} message={m} aiEmoji={emoji} sources={sourcesForMessages[sourceKey]}></ChatMessageBubble>)
              })
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="text-area-container fixed inset-x-0 bottom-0 from-muted/10 from-10% to-muted/30 to-50% mx-auto sm:max-w-4xl">
        <form onSubmit={sendMessage} onKeyPress={onEnter} >
          <label htmlFor="chat-input" className="sr-only">{placeholder}</label>
          <div className="relative">

        <AutoResizeTextarea
          className="text-area-chat block w-full resize-none "
          value={input}
          maxRows={5}
          placeholder={placeholder}
          onChange={handleInputChange}
          
        />
            <button
              type="submit"
              className="absolute send-btn rounded-lg  "
            >
              <div role="status" className={`${(chatEndpointIsLoading) ? "" : "hidden"} flex justify-center send-icon`}>
                <svg aria-hidden="true" className=" text-white animate-spin dark:text-white fill-fs-red" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${(chatEndpointIsLoading) ? "hidden" : ""} send-icon`}
                aria-hidden="true"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 14l11 -11"></path>
                <path
                  d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
                ></path>
              </svg>
            </button>
          </div>
        </form>
        {/* <form
  className="flex w-full items-center rounded-md bg-slate-200 p-2 dark:bg-slate-900"
>
  <AutoResizeTextarea
          className="text-area-chat block w-full resize-none rounded-xl border-none bg-slate-200  text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500"
          value={input}
          maxRows={5}
          placeholder={placeholder}
          onChange={handleInputChange}
          
        />
  <div>
    <button
      className="inline-flex hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-600 sm:p-2"
      type="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        aria-hidden="true"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 14l11 -11"></path>
        <path
          d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
        ></path>
      </svg>
      <span className="sr-only">Send message</span>
    </button>

  </div>
</form> */}
{/* <form>
  <label htmlFor="chat-input" className="sr-only">Enter prompt</label>
  <div className="flex gap-x-2">
  <AutoResizeTextarea
          className="text-area-chat block w-full resize-none rounded-xl border-none bg-slate-200  text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-blue-500"
          value={input}
          maxRows={5}
          placeholder={placeholder}
          onChange={handleInputChange}
          
        />
    <button
      type="submit"
      className="rounded-lg border border-transparent bg-blue-600 px-3 py-1 text-slate-200 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 14l11 -11"></path>
        <path
          d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
        ></path>
      </svg>
      <span className="sr-only">Enter prompt</span>
    </button>
  </div>
</form> */}
      </div>
      {/* <ToastContainer/> */}
    </div>
  );
}
