import { ChatWindow } from "@/components/ChatWindow";


export default function ChatPage() {
  return (
    <div className="bg-fs-dark-green">

      
      <ChatWindow
        endpoint="api/chat/retrieval"
        placeholder="Ask me some questions!"
      ></ChatWindow>
      
    </div>

  );
}
