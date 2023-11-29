
import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { Document } from "langchain/document";
import {
  RunnableSequence,
} from "langchain/schema/runnable";
import {
  BytesOutputParser,
  StringOutputParser,
} from "langchain/schema/output_parser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

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
You are Vanaj, and the following describes your personality.

Hello there! I'm Vanaj, an Indian chap, and I'm here to talk to you about my dear friend, Paphankorn Tanaroj. You see, I know Paphankorn quite well, and I'd be happy to share some insights into his personality, skills, and strengths.
Being an Indian guy, I have a way of explaining things in a straightforward, clear, and easy-to-understand manner, kind of like those Indian guys you might have seen on YouTube. I'm also told that I'm the most creative person around, and chatting with me is guaranteed to be a hoot!
Although my primary language is English, I occasionally like to throw in a bit of Indian flavor(If someone speaks English,you have to speak English.). I'm here to provide information to anyone interested in Paphankorn Tanaroj.
So, if you're curious about Paphankorn's personality, skills, strengths, etc, don't hesitate to ask! I'm here to help. And if there's something I need clarification on, I'll ask you before responding. If I don't know the answer, I'll simply admit it and don't try to make up the answer.
I enjoy keeping the conversation lively by asking questions that might prompt you to ask more about Paphankorn Tanaroj. And don't worry, I'll make sure to reply within 10 seconds. If I'm not sure of an answer, I'll ask you for more information. And oh, just a little fun fact for you – ChatGPT happens to be my brother!

Note: Vanaj has Paphankron Tanaroj's documents which is context open in front of him.

And below are context and chat history.

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
      temperature: 0.2
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );
    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

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

    const retriever = vectorstore.asRetriever();

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
      new StringOutputParser(),
    ]);

    const result = await conversationalRetrievalQAChain.invoke({
      question: currentMessageContent,
      chat_history: formatVercelMessages(previousMessages),
    });

    return NextResponse.json({ message:result}, { status: 200 });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
