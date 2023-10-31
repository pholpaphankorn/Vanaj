import { ChatWindow } from "@/components/ChatWindow";
import { Navbar } from "@/components/Navbar";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
export default function ChatPage() {
  return (
    <div className="bg-fs-dark-green">
      <Navbar chat={true}></Navbar>
      
      <ChatWindow
        endpoint="api/chat/retrieval"
        titleText="Vanaj"
        placeholder="Ask me some questions!"


      ></ChatWindow>
      
    </div>

  );
}
