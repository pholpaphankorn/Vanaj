"use client";




import { useChat } from "ai/react";
import { useRef, useState, useEffect } from "react";
import type { FormEvent } from "react";



import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import type { Message } from "ai/react";

import { AutoResizeTextarea } from "@/components/AutoResizeTextarea";
import { Navbar } from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ApologyScreen from "@/components/ApologyScreen";
import { CircularProfile } from "@/components/CircularProfile";



export function ChatWindow(props: {
  endpoint: string,
  placeholder?: string,
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, placeholder } = props;

  const [imageProfileisLoaded, setImageProfileIsLoaded] = useState(false);

  const [IsWaitingPageVisible, setIsWaitingPageVisible] = useState(false);

  const [messageStore, setMessageStore] = useState([]);

  const imgRef = useRef<HTMLImageElement>(null);

  const waitDuration = 60000;
  const imageTimeOutIdRef = useRef<NodeJS.Timeout | null>(null);
  const replyTimeOutIdRef = useRef<NodeJS.Timeout | null>(null);

  const { messages, input, setInput, handleInputChange, setMessages } =
    useChat({
      api: endpoint,
      onResponse: async () => {
      },
      onError: () => {
      }
    });
  const [chatEndpointIsLoading, setChatEndpointIsLoading] = useState(false);
  async function handleLoadProfileImage() {

    setImageProfileIsLoaded(true);
  }
  function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent;


    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }

    return "unknown";
  }
  async function onEnter(e: any) {
    const os = getMobileOperatingSystem();
    if (e.key === 'Enter' && !e.shiftKey && os == 'unknown') {
      await sendMessage(e);
    }
  }
  async function sendMessage(e: FormEvent<HTMLFormElement>) {

    e.preventDefault();
    const messageInput = e.currentTarget.querySelector('[name="message"]') as HTMLInputElement;
    const userInput = messageInput.value;
    const containsNonWhitespace = /\S/.test(userInput);


    if (!containsNonWhitespace) {
      setInput("");
      return;
    }

    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading) {
      return;
    }

    storeQuestions();
    setInput("");
    const userInputId: string = (messages.length + 1).toString()
    const inputMessage: Message = { id: userInputId, content: userInput, role: 'user', createdAt: new Date() }
    setChatEndpointIsLoading(true);
    setMessages([...messages, inputMessage]);
    const responseMessages = await getAIResponse(inputMessage);
    setChatEndpointIsLoading(false);
    setMessages([...messages, inputMessage, responseMessages]);



  }
  async function getAIResponse(inputMessage: Object) {


    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [...messages, inputMessage] }),
    });
    if (!response.ok) {
      setIsWaitingPageVisible(true);
    }
    const responseJSON = await response.json();
    const responseMessageId: string = (messages.length + 2).toString()
    const responseMessages: Message = { id: responseMessageId, content: responseJSON.message, role: 'assistant', createdAt: new Date() }

    return responseMessages

  }

  async function storeQuestions() {

    const message = { question: input, created_at: new Date() }
    try {
      const response = await fetch("/api/retrieval/database", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
      });
      const json = await response.json();

    } catch (e) {

    }
  }
  useEffect(() => {
    if (imgRef!.current && imgRef!.current!.complete) {
      // If the image is already loaded, set to true
      setImageProfileIsLoaded(true);
    }

  }, []);

  useEffect(() => {
    clearTimeout(replyTimeOutIdRef!.current as unknown as number);
    window.scrollTo(0, document.body.scrollHeight);
    return () => {
      // Clear the timeout when the component is unmounted
      clearTimeout(replyTimeOutIdRef!.current as unknown as number);
    };
  }, [messages]);

  useEffect(() => {
    if (chatEndpointIsLoading) {
      // Set a timeout to show the waiting page after the wait duration
      replyTimeOutIdRef!.current = setTimeout(() => {
        setIsWaitingPageVisible(true);
      }, waitDuration);
    }

  }, [chatEndpointIsLoading]);

  useEffect(() => {

    if (!imageProfileisLoaded) {
      // Clear the timeout when the component is unmounted
      imageTimeOutIdRef!.current = setTimeout(() => {
        setIsWaitingPageVisible(true);
      }, waitDuration);
    } else {
      clearTimeout(imageTimeOutIdRef!.current as unknown as number);
    }

  }, [imageProfileisLoaded]);


  return (
    <>
      {IsWaitingPageVisible && <ApologyScreen />}
      {!IsWaitingPageVisible && <Navbar chat={true} handleLoad={handleLoadProfileImage} display={`${imageProfileisLoaded ? "" : "hidden"}`} imgRef={imgRef} />}
      {!imageProfileisLoaded && !IsWaitingPageVisible && <LoadingScreen />}
      {imageProfileisLoaded && !IsWaitingPageVisible && (
        <div className={`chat-window flex flex-col items-center p-4 md:p-8 rounded grow mx-auto sm:max-w-5xl sm:px-4 p-4 md:p-12 min-h-[100vh] `}>

          <div
            className="flex w-full"
            ref={messageContainerRef}
          >
            <div
              className="flex flex-col-reverse w-full mt-[6vh] mb-[6vh] md:mt-[8vh] md:mb-[8vh] transition-[flex-grow] ease-in-out"
            >
              {chatEndpointIsLoading ?
                <div className="flex items-start items-center ">
                  <CircularProfile active={true} type="chat" />
                  <div className="typing">
                    <div className="typing__dot"></div>
                    <div className="typing__dot"></div>
                    <div className="typing__dot"></div>
                  </div>
                </div> : ""}
              {messages.length > 0 ? (
                [...messages]
                  .reverse()
                  .map((m, i) => {
                    return (
                      <ChatMessageBubble key={m.id} message={m}></ChatMessageBubble>)
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
                  name="message"

                />
                <button
                  type="submit"
                  className="absolute send-btn rounded-lg  "
                >
                  <div role="status" className={`${(chatEndpointIsLoading) ? "" : "hidden"} flex justify-center send-icon`}>
                    <svg aria-hidden="true" className="animate-spin fill-fs-red outline-none border-none" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>


        </div>)}



    </>




  );
}
