import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";

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
// export async function DELETE(req: NextRequest) {

//   try {
//     const client = createClient(
//       process.env.SUPABASE_URL!,
//       process.env.SUPABASE_PRIVATE_KEY!,
//     );
//     const { error } = await client
//     .from('documents')
//     .delete().neq('id', 0)

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message}, { status: 500 });
//   }
// }
