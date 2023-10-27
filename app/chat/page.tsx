import { ChatWindow } from "@/components/ChatWindow";
import { Navbar } from "@/components/Navbar";
export default function ChatPage() {
  return (
    <>
      <Navbar chat={true}></Navbar>
      <ChatWindow
        endpoint="api/chat/retrieval"
        titleText="Vanaj"
        placeholder="Ask me anything!"

      ></ChatWindow>
    </>

  );
}
