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

    const { resumeData, jobDescription } = await req.json()
    
    if (!resumeData || !jobDescription) {
      return new NextResponse("Resume data and job description are required", { status: 400 })
    }

    const resumeText = buildResumeText(resumeData)

    const prompt = `
      You are an expert ATS (Applicant Tracking System) analyst. 
      Analyze the following resume against the provided job description.
      
      RESUME:
      ${resumeText}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      Provide your analysis in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
      {
        "score": <number between 0-100>,
        "summary": "<2-3 sentence overall assessment>",
        "matchedKeywords": ["<keyword1>", "<keyword2>", ...],
        "missingKeywords": ["<keyword1>", "<keyword2>", ...],
        "suggestions": [
          "<specific actionable suggestion 1>",
          "<specific actionable suggestion 2>",
          "<specific actionable suggestion 3>"
        ]
      }
    `

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    })

    let text = response.text.trim()
    // Remove possible markdown code block wrapper
    text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
    
    const analysis = JSON.parse(text)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("ATS analysis error:", error)
    return new NextResponse("Failed to analyze resume", { status: 500 })
  }
}

function buildResumeText(data) {
  let text = ''
  if (data.personalInfo) {
    text += `Name: ${data.personalInfo.name || ''}\n`
    text += `Summary: ${data.personalInfo.summary || ''}\n\n`
  }
  if (data.experience?.length) {
    text += 'EXPERIENCE:\n'
    data.experience.forEach(e => {
      text += `${e.role} at ${e.company} (${e.date})\n`
      e.bullets?.forEach(b => { text += `- ${b}\n` })
      text += '\n'
    })
  }
  if (data.education?.length) {
    text += 'EDUCATION:\n'
    data.education.forEach(e => {
      text += `${e.degree} - ${e.school} (${e.gradYear})\n`
    })
    text += '\n'
  }
  if (data.skills?.length) {
    text += `SKILLS: ${data.skills.join(', ')}\n\n`
  }
  if (data.projects?.length) {
    text += 'PROJECTS:\n'
    data.projects.forEach(p => {
      text += `${p.name}: ${p.description}\n`
    })
    text += '\n'
  }
  if (data.certifications?.length) {
    text += 'CERTIFICATIONS:\n'
    data.certifications.forEach(c => {
      text += `${c.name} - ${c.issuer} (${c.date})\n`
    })
  }
  return text
}
