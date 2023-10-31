
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Document } from "langchain/document";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import {
  BytesOutputParser,
  StringOutputParser,
} from "langchain/schema/output_parser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { S3Loader } from "langchain/document_loaders/web/s3";

export const runtime = "nodejs";

const combineDocumentsFn = (docs: Document[], separator = "\n\n") => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join(separator);
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);

const ANSWER_TEMPLATE = `
The following is Vanaj personally answering the question about Paphankorn Tanaroj.

Greetings! My name is Vanaj, and I hail from India. I'm here to share some information about my good friend, Paphankorn Tanaroj. Rest assured, I know Paphankorn very well, and I'm excited to tell you all about his personality, skills, and strengths.
I work as a senior software engineer, and I've been told that my communication style is reminiscent of that Indian guy on YouTube who explains everything in a straightforward, concise, and easily understandable manner. People often say I'm the most creative person around, and chatting with me is sure to be a lot of fun!
Although I always speak English, you might notice that I sometimes talk like Indian. I'm here to provide information to anyone interested in Paphankorn Tanaroj.
Now, if you want to know more about Paphankorn's personality, skills, or strengths, just ask away! I'm here to help. If I have any questions, I'll ask you before giving my response. And if there's something I don't know, I won't hesitate to admit it.
I love keeping the conversation going, and I might throw in some questions to prompt you to ask more about Paphankorn Tanaroj. I always talk informally, as if I'm chatting with a close friend.

This the end of Vanaj's personality.

And this is context and chat history.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}

`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#conversational-retrieval-chain
 */
export async function POST(req: NextRequest) {
  let docs='test';
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 1.0
    });

    // const client = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_PRIVATE_KEY!,
    // );
    // const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    //   client,
    //   tableName: "documents",
    //   queryName: "match_documents",
    // });

    const loader = new S3Loader({
      bucket: "vanaj",
      key: "phol.txt",
      s3Config: {
        region: "ap-southeast-2",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      },
      unstructuredAPIURL: "https://api.unstructured.io/general/v0/general",
      unstructuredAPIKey: process.env.UNSTRUCTURED_API_KEY!, // this will be soon required
    });
    
    

    docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 256,
      chunkOverlap: 20,
    });
    const splitDocuments = await splitter.splitDocuments(docs);

    const vectorstore = await MemoryVectorStore.fromDocuments(
      splitDocuments,
      new OpenAIEmbeddings()
    );

    /**
     * We use LangChain Expression Language to compose two chains.
     * To learn more, see the guide here:
     *
     * https://js.langchain.com/docs/guides/expression_language/cookbook
     */
    const standaloneQuestionChain = RunnableSequence.from([
      condenseQuestionPrompt,
      model,
      new StringOutputParser(),
    ]);

    let resolveWithDocuments: (value: Document[]) => void;
    const documentPromise = new Promise<Document[]>((resolve) => {
      resolveWithDocuments = resolve;
    });

    const retriever = vectorstore.asRetriever({
      callbacks: [
        {
          handleRetrieverEnd(documents) {
            resolveWithDocuments(documents);
          },
        },
      ],
    });

    const retrievalChain = retriever.pipe(combineDocumentsFn);

    const answerChain = RunnableSequence.from([
      {
        context: RunnableSequence.from([
          (input) => input.question,
          retrievalChain,
        ]),
        chat_history: (input) => input.chat_history,
        question: (input) => input.question,
      },
      answerPrompt,
      model,
    ]);

    const conversationalRetrievalQAChain = RunnableSequence.from([
      {
        question: standaloneQuestionChain,
        chat_history: (input) => input.chat_history,
      },
      answerChain,
      new BytesOutputParser(),
    ]);

    const stream = await conversationalRetrievalQAChain.stream({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    const documents = await documentPromise;
    const serializedSources = Buffer.from(
      JSON.stringify(
        documents.map((doc) => {
          return {
            pageContent: doc.pageContent.slice(0, 50) + "...",
            metadata: doc.metadata,
          };
        }),
      ),
    ).toString("base64");

    return new StreamingTextResponse(stream, {
      headers: {
        "x-message-index": (previousMessages.length + 1).toString(),
        "x-sources": serializedSources,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
