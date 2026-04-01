"use client"

import { useState } from "react"
import { Mail, Send } from "lucide-react"
import { ToastProvider, useToast } from "@/components/Toast"
import styles from "@/app/page.module.css"

function ContactSectionContent() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSending(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to send message")
      }

      toast.success("Your message has been sent.")
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error(error)
      toast.error("Could not send your message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section className={`glass glass-panel ${styles.contactSection}`}>
      <div className={styles.contactIntro}>
        <div className={styles.badge}>
          <Mail size={14} className={styles.badgeIcon} />
          <span>Contact</span>
        </div>
        <h2 className={styles.contactTitle}>Send Me a Message</h2>
        <p className={styles.contactText}>
          Have a question, project idea, or feedback? Fill out the form and your
          message will be sent directly to my email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.contactGrid}>
          <div>
            <label className="label" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="contact-subject">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            className="input-field"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can I help?"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            className={`input-field ${styles.contactTextarea}`}
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={sending}>
          <Send size={16} style={{ marginRight: "0.5rem" }} />
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  )
}

export default function ContactSection() {
  return (
    <ToastProvider>
      <ContactSectionContent />
    </ToastProvider>
  )
}
