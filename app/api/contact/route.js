import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass || Number.isNaN(port)) {
    throw new Error("SMTP environment variables are not fully configured.")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return new NextResponse("All fields are required.", { status: 400 })
    }

    const recipient = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER
    const fromAddress = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER

    if (!recipient || !fromAddress) {
      return new NextResponse("Contact email configuration is missing.", {
        status: 500,
      })
    }

    const transporter = getTransporter()

    await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return new NextResponse("Unable to send message right now.", {
      status: 500,
    })
  }
}
