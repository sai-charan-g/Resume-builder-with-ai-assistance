import React, { forwardRef } from 'react'

const ClassicTemplate = forwardRef(({ resumeData, targetJob }, ref) => {
  if (!resumeData) return <div ref={ref}>No resume data</div>

  const content = resumeData;
  const theme = content.theme || { color: '#000000', fontFamily: "'Inter', sans-serif" };
  const skills = content.skills || [];
  const projects = content.projects || [];
  const certifications = content.certifications || [];
  const languages = content.languages || [];
  const customSections = content.customSections || [];

  return (
    <div 
      ref={ref} 
      style={{
        width: '100%',
        maxWidth: '8.5in',
        minHeight: '11in',
        margin: '0 auto',
        padding: '0.5in',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: theme.fontFamily,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontSize: '11pt'
      }}
    >
      <header style={{ borderBottom: `2px solid ${theme.color}`, paddingBottom: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 700, margin: '0 0 0.5rem 0', letterSpacing: '-0.5px', color: theme.color }}>
          {content.personalInfo.name || "YOUR NAME"}
        </h1>
        <h2 style={{ fontSize: '14pt', fontWeight: 500, color: '#444', margin: '0 0 0.5rem 0' }}>
          {targetJob || "Professional Title"}
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '10pt', color: '#555', flexWrap: 'wrap' }}>
          {(content.personalInfo.email || "email@example.com") && <span>{content.personalInfo.email || "email@example.com"}</span>}
          <span>•</span>
          <span>{content.personalInfo.phone || "(555) 123-4567"}</span>
          <span>•</span>
          <span>{content.personalInfo.location || "City, State"}</span>
          {content.personalInfo.linkedin && <><span>•</span><span>{content.personalInfo.linkedin}</span></>}
          {content.personalInfo.website && <><span>•</span><span>{content.personalInfo.website}</span></>}
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Professional Summary */}
        <section>
          <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
            Professional Summary
          </h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            {content.personalInfo.summary || "A dedicated and results-driven professional with a proven track record."}
          </p>
        </section>

        {/* Experience */}
        {content.experience.length > 0 && (
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              Experience
            </h3>
            {content.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt' }}>{exp.role}</strong>
                  <span style={{ fontSize: '10pt' }}>{exp.date}</span>
                </div>
                <div style={{ fontStyle: 'italic', marginBottom: '0.25rem' }}>{exp.company}</div>
                <ul style={{ margin: '0', paddingLeft: '1.2rem' }}>
                  {exp.bullets?.map((b, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        <section>
          <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
            Education
          </h3>
          {content.education.length > 0 ? content.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt' }}>{edu.school}</strong>
                <span style={{ fontSize: '10pt' }}>{edu.gradYear}</span>
              </div>
              <div>{edu.degree}</div>
            </div>
          )) : (
            <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Add your education above.</div>
          )}
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{ padding: '0.2rem 0.6rem', backgroundColor: `${theme.color}10`, border: `1px solid ${theme.color}30`, borderRadius: '4px', fontSize: '10pt' }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              Projects
            </h3>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt' }}>{proj.name}</strong>
                  {proj.link && <span style={{ fontSize: '9pt', color: theme.color }}>{proj.link}</span>}
                </div>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '10.5pt' }}>{proj.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              Certifications
            </h3>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{cert.name}</strong> — {cert.issuer}</span>
                <span style={{ fontSize: '10pt' }}>{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              Languages
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {languages.map((lang, idx) => (
                <span key={idx}><strong>{lang.name}</strong> — {lang.proficiency}</span>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((section, idx) => (
          <section key={idx}>
            <h3 style={{ fontSize: '12pt', fontWeight: 600, borderBottom: `1px solid ${theme.color}40`, color: theme.color, margin: '0 0 0.5rem 0', paddingBottom: '0.25rem', textTransform: 'uppercase' }}>
              {section.title || "Custom Section"}
            </h3>
            <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  )
})

ClassicTemplate.displayName = "ClassicTemplate"
export default ClassicTemplate
