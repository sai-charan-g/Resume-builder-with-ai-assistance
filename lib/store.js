import { create } from 'zustand'

export const useResumeStore = create((set) => ({
  resumeData: {
    theme: {
      color: '#2563eb', // Default Blue
      fontFamily: "'Inter', sans-serif",
      template: 'classic', // classic | modern | two-column
    },
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  },
  
  // High-level setter for initializing from DB
  setResumeData: (data) => set({ resumeData: data }),

  // Actions
  updateTheme: (theme) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      theme: { ...(state.resumeData.theme || {}), ...theme }
    }
  })),

  updatePersonalInfo: (info) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      personalInfo: { ...state.resumeData.personalInfo, ...info }
    }
  })),
  
  // Experience
  addExperience: (exp) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      experience: [...state.resumeData.experience, exp]
    }
  })),
  
  updateExperience: (index, exp) => set((state) => {
    const newExp = [...state.resumeData.experience]
    newExp[index] = { ...newExp[index], ...exp }
    return { resumeData: { ...state.resumeData, experience: newExp } }
  }),

  removeExperience: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      experience: state.resumeData.experience.filter((_, i) => i !== index)
    }
  })),

  moveExperience: (fromIndex, toIndex) => set((state) => {
    const items = [...state.resumeData.experience]
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    return { resumeData: { ...state.resumeData, experience: items } }
  }),

  // Education
  addEducation: (edu) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      education: [...state.resumeData.education, edu]
    }
  })),
  
  updateEducation: (index, edu) => set((state) => {
    const newEdu = [...state.resumeData.education]
    newEdu[index] = { ...newEdu[index], ...edu }
    return { resumeData: { ...state.resumeData, education: newEdu } }
  }),

  removeEducation: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      education: state.resumeData.education.filter((_, i) => i !== index)
    }
  })),

  moveEducation: (fromIndex, toIndex) => set((state) => {
    const items = [...state.resumeData.education]
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    return { resumeData: { ...state.resumeData, education: items } }
  }),

  // Skills
  setSkills: (skills) => set((state) => ({
    resumeData: { ...state.resumeData, skills }
  })),

  addSkill: (skill) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      skills: [...state.resumeData.skills, skill]
    }
  })),

  removeSkill: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      skills: state.resumeData.skills.filter((_, i) => i !== index)
    }
  })),

  // Projects
  addProject: (proj) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      projects: [...(state.resumeData.projects || []), proj]
    }
  })),

  updateProject: (index, proj) => set((state) => {
    const items = [...(state.resumeData.projects || [])]
    items[index] = { ...items[index], ...proj }
    return { resumeData: { ...state.resumeData, projects: items } }
  }),

  removeProject: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      projects: (state.resumeData.projects || []).filter((_, i) => i !== index)
    }
  })),

  moveProject: (fromIndex, toIndex) => set((state) => {
    const items = [...(state.resumeData.projects || [])]
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    return { resumeData: { ...state.resumeData, projects: items } }
  }),

  // Certifications
  addCertification: (cert) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      certifications: [...(state.resumeData.certifications || []), cert]
    }
  })),

  updateCertification: (index, cert) => set((state) => {
    const items = [...(state.resumeData.certifications || [])]
    items[index] = { ...items[index], ...cert }
    return { resumeData: { ...state.resumeData, certifications: items } }
  }),

  removeCertification: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      certifications: (state.resumeData.certifications || []).filter((_, i) => i !== index)
    }
  })),

  // Languages
  addLanguage: (lang) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      languages: [...(state.resumeData.languages || []), lang]
    }
  })),

  updateLanguage: (index, lang) => set((state) => {
    const items = [...(state.resumeData.languages || [])]
    items[index] = { ...items[index], ...lang }
    return { resumeData: { ...state.resumeData, languages: items } }
  }),

  removeLanguage: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      languages: (state.resumeData.languages || []).filter((_, i) => i !== index)
    }
  })),

  // Custom Sections
  addCustomSection: (section) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      customSections: [...(state.resumeData.customSections || []), section]
    }
  })),

  updateCustomSection: (index, section) => set((state) => {
    const items = [...(state.resumeData.customSections || [])]
    items[index] = { ...items[index], ...section }
    return { resumeData: { ...state.resumeData, customSections: items } }
  }),

  removeCustomSection: (index) => set((state) => ({
    resumeData: {
      ...state.resumeData,
      customSections: (state.resumeData.customSections || []).filter((_, i) => i !== index)
    }
  })),
}))
