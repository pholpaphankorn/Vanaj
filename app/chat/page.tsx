import { ChatWindow } from "@/components/ChatWindow";
import WaitingScreen from "@/components/ApologyScreen";

export default function ChatPage() {
  return (
    <div className="bg-fs-dark-green">

      
      <ChatWindow
        endpoint="api/chat/retrieval"
        titleText="Vanaj"
        placeholder="Ask me some questions!"


      ></ChatWindow>

      {/* <WaitingScreen/> */}
      
    </div>

  );
}
