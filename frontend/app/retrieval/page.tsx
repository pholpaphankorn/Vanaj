import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export default async function RetrievalPage() {
  
    const session=await getServerSession();
    if (!session||!session.user) {
    
      redirect("/api/auth/signin?callbackUrl=/retrieval");
    }

    return (
          <div className="bg-fs-dark-green">
            <UploadDocumentsForm />
          </div>
      );
}


