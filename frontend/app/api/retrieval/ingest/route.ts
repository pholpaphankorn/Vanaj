import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

export const runtime = "nodejs";

// Before running, follow set-up instructions at
// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */
export async function POST(req: NextRequest) {
  const data = await req.formData()
  const blob: Blob | null = data.get('file') as unknown as Blob
  const file_extension = data.get('file_extension') as unknown as string
  if (!blob) {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  try {
    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );
    var loader;
    if (file_extension=='txt'){
     loader = new TextLoader(blob);
    }else if (file_extension=='pdf'){
     loader = new PDFLoader(blob,{
      splitPages: false,
     });
    }else if (file_extension=='docx'){
     loader = new DocxLoader(blob);
    }else{
    return NextResponse.json({ error: 'File extension not supported' }, { status: 500 });
    }
    if (loader==null){
      return NextResponse.json({ error: 'Failed loading file' }, { status: 500 });
    }
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 256,
      chunkOverlap: 20,
    });

    const splitDocuments = await splitter.splitDocuments(docs);



    const vectorstore = await SupabaseVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings(),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      },
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
