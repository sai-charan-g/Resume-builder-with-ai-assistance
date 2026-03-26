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

    const { resumeData, targetJob } = await req.json()

    if (!resumeData) {
      return new NextResponse("Resume data is required", { status: 400 })
    }

    const resumeText = buildResumeText(resumeData, targetJob)

    const prompt = `
You are an expert career coach and professional resume reviewer.
Analyze the following resume and provide personalized, actionable recommendations to make it stronger.

RESUME:
${resumeText}

TARGET JOB: ${targetJob || "Not specified"}

Provide your analysis in EXACTLY this JSON format (no markdown, no code blocks, just raw JSON):
{
  "overallRating": <number 1-10>,
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>"
  ],
  "recommendations": [
    {
      "category": "<one of: Content, Formatting, Keywords, Impact, Missing Sections>",
      "priority": "<High | Medium | Low>",
      "title": "<short recommendation title>",
      "description": "<detailed actionable advice, 1-2 sentences>"
    }
  ],
  "suggestedSkills": ["<skill1>", "<skill2>", "<skill3>"],
  "improvedSummary": "<if the summary is weak or missing, suggest a better one, otherwise return empty string>"
}

Provide 5-8 recommendations. Be specific and reference actual content from the resume.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.4,
      }
    })

    let text = response.text.trim()
    text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    const analysis = JSON.parse(text)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("AI Recommendations error:", error)
    return new NextResponse("Failed to generate recommendations", { status: 500 })
  }
}

function buildResumeText(data, targetJob) {
  let text = ''
  if (data.personalInfo) {
    text += `Name: ${data.personalInfo.name || 'Not provided'}\n`
    text += `Email: ${data.personalInfo.email || 'Not provided'}\n`
    text += `Phone: ${data.personalInfo.phone || 'Not provided'}\n`
    text += `Location: ${data.personalInfo.location || 'Not provided'}\n`
    text += `LinkedIn: ${data.personalInfo.linkedin || 'Not provided'}\n`
    text += `Website: ${data.personalInfo.website || 'Not provided'}\n`
    text += `Summary: ${data.personalInfo.summary || 'Not provided'}\n\n`
  }
  if (data.experience?.length) {
    text += 'EXPERIENCE:\n'
    data.experience.forEach(e => {
      text += `${e.role || 'No role'} at ${e.company || 'No company'} (${e.date || 'No date'})\n`
      e.bullets?.forEach(b => { if (b.trim()) text += `  - ${b}\n` })
      text += '\n'
    })
  } else {
    text += 'EXPERIENCE: None provided\n\n'
  }
  if (data.education?.length) {
    text += 'EDUCATION:\n'
    data.education.forEach(e => {
      text += `${e.degree || 'No degree'} - ${e.school || 'No school'} (${e.gradYear || 'No year'})\n`
    })
    text += '\n'
  } else {
    text += 'EDUCATION: None provided\n\n'
  }
  if (data.skills?.length) {
    text += `SKILLS: ${data.skills.join(', ')}\n\n`
  } else {
    text += 'SKILLS: None provided\n\n'
  }
  if (data.projects?.length) {
    text += 'PROJECTS:\n'
    data.projects.forEach(p => {
      text += `${p.name}: ${p.description || 'No description'}\n`
    })
    text += '\n'
  }
  if (data.certifications?.length) {
    text += 'CERTIFICATIONS:\n'
    data.certifications.forEach(c => {
      text += `${c.name} - ${c.issuer || ''} (${c.date || ''})\n`
    })
    text += '\n'
  }
  if (data.languages?.length) {
    text += 'LANGUAGES:\n'
    data.languages.forEach(l => {
      text += `${l.name} (${l.proficiency || ''})\n`
    })
    text += '\n'
  }
  text += `TARGET ROLE: ${targetJob || 'Not specified'}\n`
  return text
}
