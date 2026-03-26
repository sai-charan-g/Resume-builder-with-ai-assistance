import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { text, type } = await req.json()
    
    if (!text) {
      return new NextResponse("Text is required", { status: 400 })
    }

    let systemPrompt = "You are an expert resume writer. Enhance the following text to be more professional, ATS-friendly, and impactful. Return only the enhanced text."
    
    if (type === 'bullets') {
      systemPrompt = "You are an expert resume writer. Improve the following bullet points for a resume. Use strong action verbs, quantifiable metrics where possible, and concise language. Return only the improved bullet points separated by newlines."
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const enhancedText = response.text || text

    return NextResponse.json({ enhancedText })
  } catch (error) {
    console.error("Gemini enhancement error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
