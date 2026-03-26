import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(resumes)
  } catch (error) {
    console.error("GET resumes error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, targetJob, duplicateFrom } = body

    // If duplicating an existing resume
    if (duplicateFrom) {
      const source = await prisma.resume.findUnique({
        where: { id: duplicateFrom, userId: session.user.id }
      })
      if (!source) {
        return new NextResponse("Source resume not found", { status: 404 })
      }

      const duplicate = await prisma.resume.create({
        data: {
          userId: session.user.id,
          title: `${source.title} (Copy)`,
          targetJob: source.targetJob || "",
          content: source.content,
          isPublic: false,
        }
      })
      return NextResponse.json(duplicate)
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: title || "Untitled Resume",
        targetJob: targetJob || "",
        content: JSON.stringify({
          theme: { color: '#2563eb', fontFamily: "'Inter', sans-serif", template: 'classic' },
          personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          languages: [],
          customSections: [],
        }),
        isPublic: false,
      }
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error("POST resume error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
