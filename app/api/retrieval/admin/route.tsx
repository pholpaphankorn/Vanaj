import { NextRequest, NextResponse } from "next/server";

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
// export async function POST(req: NextRequest) {

//     const json = await req.json();
//     const username = json.username;
//     const password = json.password;
//   try {
//     const loggedIn=username === process.env.ADMIN_USERNAME! && password === process.env.ADMIN_PASSWORD!
//     return NextResponse.json({ success: loggedIn }, { status: 200 });


    
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message, success:false}, { status: 500 });
//   }
// }
