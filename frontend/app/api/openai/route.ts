import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = completion.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("OpenAI API error:", error);
    const message =
      error instanceof Error ? error.message : "OpenAI request failed";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
