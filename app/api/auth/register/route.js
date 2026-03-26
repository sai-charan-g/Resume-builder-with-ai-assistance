import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return new NextResponse("Missing input", { status: 400 })
    }

    const exist = await prisma.user.findUnique({
      where: { email: email }
    })

    if (exist) {
      return new NextResponse("User already exists", { status: 400 })
    }

    // NOTE: In production, hash the password (e.g. const hashedPassword = await bcrypt.hash(password, 10))
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password // storing plain text MVP
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Registration error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
