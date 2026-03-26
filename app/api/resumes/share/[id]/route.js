import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Public route - no auth required
export async function GET(req, { params }) {
  const resolvedParams = await params;
  try {
    const resume = await prisma.resume.findUnique({
      where: {
        id: resolvedParams.id,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    if (!resume || !resume.isPublic) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json({
      title: resume.title,
      targetJob: resume.targetJob,
      content: resume.content,
      authorName: resume.user?.name || "Anonymous",
    })
  } catch (error) {
    console.error("GET shared resume error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
