import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { targetJob, experience } = await req.json();

    const experienceContext = experience && experience.length > 0 
      ? experience.map(e => `- ${e.role} at ${e.company}: ${e.bullets?.join(", ") || ''}`).join("\n") 
      : "No detailed experience provided.";

    const prompt = `
      You are an expert executive resume writer. 
      Please write a highly professional, engaging, and concise 3-4 sentence Professional Summary for a resume.
      Target Job Role: ${targetJob || "Professional"}
      Recent Experience Context:
      ${experienceContext}
      
      Do not include any intro or outro text. Just provide the summary paragraphs directly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const summary = response.text.trim();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Gemini Error:", error);
    return new NextResponse("Failed to generate", { status: 500 });
  }
}
