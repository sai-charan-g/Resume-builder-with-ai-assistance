"use client"

import ClassicTemplate from "@/components/templates/ClassicTemplate"
import ModernTemplate from "@/components/templates/ModernTemplate"
import TwoColumnTemplate from "@/components/templates/TwoColumnTemplate"

const templateMap = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  "two-column": TwoColumnTemplate,
}

export default function ResumeTemplate({ resumeData, targetJob }) {
  const templateKey = resumeData?.theme?.template || "classic"
  const TemplateComponent = templateMap[templateKey] || ClassicTemplate

  return <TemplateComponent resumeData={resumeData} targetJob={targetJob} />
}
