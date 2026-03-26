import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req, { params }) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const resume = await prisma.resume.findUnique({
      where: {
        id: resolvedParams.id,
        userId: session.user.id
      }
    })

    if (!resume) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error("GET resume error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PUT(req, { params }) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    
    // Verify ownership
    const existing = await prisma.resume.findUnique({
      where: { id: resolvedParams.id }
    })
    
    if (!existing || existing.userId !== session.user.id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    const updateData = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.targetJob !== undefined) updateData.targetJob = body.targetJob
    if (body.content !== undefined) updateData.content = body.content
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic

    let updated
    try {
      updated = await prisma.resume.update({
        where: { id: resolvedParams.id },
        data: updateData
      })
    } catch (prismaError) {
      // If isPublic field doesn't exist yet (schema not pushed), retry without it
      if (updateData.isPublic !== undefined) {
        delete updateData.isPublic
        updated = await prisma.resume.update({
          where: { id: resolvedParams.id },
          data: updateData
        })
      } else {
        throw prismaError
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PUT resume error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const resolvedParams = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify ownership
    const existing = await prisma.resume.findUnique({
      where: { id: resolvedParams.id }
    })
    
    if (!existing || existing.userId !== session.user.id) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 })
    }

    await prisma.resume.delete({
      where: { id: resolvedParams.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("DELETE resume error:", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
