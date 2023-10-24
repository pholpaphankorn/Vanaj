import { ChatWindow } from "@/components/ChatWindow";


export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Hi, I&apos;m Vanaj.
      </h1>
      <p>
      I&apos;m a close friend of Paphankorn Tanaroj. I&apos;m here to answer any questions you might have. Don&apos;t hesitate to reach out!
      </p>
    </div>
  );
  const id = 'phol'
  return (
    <ChatWindow
      endpoint="api/chat/retrieval"
      titleText="Vanaj"
      placeholder="Ask me anything!"
      emptyStateComponent={InfoCard}
    ></ChatWindow>


  );
}
