import { ChatWindow } from "@/components/ChatWindow";


export default function ChatPage() {
  return (
    <div className="bg-fs-dark-green">

      
      <ChatWindow
        endpoint={process.env.VANAJ_BACKEND_URL+"/api/chat"}
        placeholder="Ask me some questions!"
      ></ChatWindow>
      
    </div>

  );
}
