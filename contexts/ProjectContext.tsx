"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface Technology {
  id: string
  name: string
  description: string
  icon: string
  category: "frontend" | "backend" | "database" | "auth" | "payment" | "ai" | "deployment"
}

interface ProjectFeature {
  id: string
  name: string
  description: string
  category: string
  dependencies?: string[]
}

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: "saas" | "ecommerce" | "blog" | "portfolio" | "dashboard" | "social" | "marketplace" | "custom"
  technologies: string[]
  features: string[]
  complexity: "beginner" | "intermediate" | "advanced"
  estimatedTime: string
  useCase: string
  suggestedDocs: string[]
  isBuiltIn?: boolean
  createdAt?: string
  updatedAt?: string
}

interface QuickStartPreset {
  technologies: string[]
  features: string[]
  description: string
}

interface ProjectState {
  // Starting point selection
  selectedTemplate: ProjectTemplate | null
  selectedPreset: string | null
  showTemplates: boolean

  // Project configuration
  projectName: string
  selectedTechnologies: string[]
  selectedFeatures: string[]

  // UI state
  expandedFolders: Set<string>

  // Custom templates
  customTemplates: ProjectTemplate[]
  isCreatingTemplate: boolean
  isEditingTemplate: boolean
  editingTemplateId: string | null
  templateForm: Partial<ProjectTemplate>
}

type ProjectAction =
  | { type: "SET_TEMPLATE"; payload: ProjectTemplate }
  | { type: "SET_PRESET"; payload: { name: string; preset: QuickStartPreset } }
  | { type: "RESET_TO_CUSTOM" }
  | { type: "SET_SHOW_TEMPLATES"; payload: boolean }
  | { type: "SET_PROJECT_NAME"; payload: string }
  | { type: "TOGGLE_TECHNOLOGY"; payload: string }
  | { type: "TOGGLE_FEATURE"; payload: string }
  | { type: "SET_TECHNOLOGIES"; payload: string[] }
  | { type: "SET_FEATURES"; payload: string[] }
  | { type: "TOGGLE_FOLDER"; payload: string }
  | { type: "START_CREATING_TEMPLATE" }
  | { type: "START_EDITING_TEMPLATE"; payload: string }
  | { type: "CANCEL_TEMPLATE_FORM" }
  | { type: "UPDATE_TEMPLATE_FORM"; payload: Partial<ProjectTemplate> }
  | { type: "SAVE_CUSTOM_TEMPLATE"; payload: ProjectTemplate }
  | { type: "UPDATE_CUSTOM_TEMPLATE"; payload: ProjectTemplate }
  | { type: "DELETE_CUSTOM_TEMPLATE"; payload: string }
  | { type: "DUPLICATE_TEMPLATE"; payload: ProjectTemplate }
  | { type: "LOAD_CUSTOM_TEMPLATES"; payload: ProjectTemplate[] }

const initialState: ProjectState = {
  selectedTemplate: null,
  selectedPreset: null,
  showTemplates: true,
  projectName: "my-fullstack-app",
  selectedTechnologies: ["react", "nodejs", "postgresql"],
  selectedFeatures: ["auth", "api", "testing"],
  expandedFolders: new Set(["root"]),
  customTemplates: [],
  isCreatingTemplate: false,
  isEditingTemplate: false,
  editingTemplateId: null,
  templateForm: {},
}

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case "SET_TEMPLATE":
      return {
        ...state,
        selectedTemplate: action.payload,
        selectedPreset: null,
        selectedTechnologies: action.payload.technologies,
        selectedFeatures: action.payload.features,
        projectName: action.payload.name.toLowerCase().replace(/\s+/g, "-"),
        showTemplates: false,
      }

    case "SET_PRESET":
      return {
        ...state,
        selectedTemplate: null,
        selectedPreset: action.payload.name,
        selectedTechnologies: action.payload.preset.technologies,
        selectedFeatures: action.payload.preset.features,
        showTemplates: false,
      }

    case "RESET_TO_CUSTOM":
      return {
        ...state,
        selectedTemplate: null,
        selectedPreset: null,
        showTemplates: false,
      }

    case "SET_SHOW_TEMPLATES":
      return {
        ...state,
        showTemplates: action.payload,
      }

    case "SET_PROJECT_NAME":
      return {
        ...state,
        projectName: action.payload,
      }

    case "TOGGLE_TECHNOLOGY":
      const techExists = state.selectedTechnologies.includes(action.payload)
      return {
        ...state,
        selectedTechnologies: techExists
          ? state.selectedTechnologies.filter((id) => id !== action.payload)
          : [...state.selectedTechnologies, action.payload],
        // Clear template/preset selection when manually modifying
        selectedTemplate: null,
        selectedPreset: null,
      }

    case "TOGGLE_FEATURE":
      const featureExists = state.selectedFeatures.includes(action.payload)
      return {
        ...state,
        selectedFeatures: featureExists
          ? state.selectedFeatures.filter((id) => id !== action.payload)
          : [...state.selectedFeatures, action.payload],
        // Clear template/preset selection when manually modifying
        selectedTemplate: null,
        selectedPreset: null,
      }

    case "SET_TECHNOLOGIES":
      return {
        ...state,
        selectedTechnologies: action.payload,
      }

    case "SET_FEATURES":
      return {
        ...state,
        selectedFeatures: action.payload,
      }

    case "TOGGLE_FOLDER":
      const newExpandedFolders = new Set(state.expandedFolders)
      if (newExpandedFolders.has(action.payload)) {
        newExpandedFolders.delete(action.payload)
      } else {
        newExpandedFolders.add(action.payload)
      }
      return {
        ...state,
        expandedFolders: newExpandedFolders,
      }

    case "START_CREATING_TEMPLATE":
      return {
        ...state,
        isCreatingTemplate: true,
        isEditingTemplate: false,
        editingTemplateId: null,
        templateForm: {
          name: "",
          description: "",
          icon: "🚀",
          category: "custom",
          technologies: [...state.selectedTechnologies],
          features: [...state.selectedFeatures],
          complexity: "intermediate",
          estimatedTime: "1-2 weeks",
          useCase: "",
          suggestedDocs: [],
        },
      }

    case "START_EDITING_TEMPLATE":
      const templateToEdit = state.customTemplates.find((t) => t.id === action.payload)
      return {
        ...state,
        isCreatingTemplate: false,
        isEditingTemplate: true,
        editingTemplateId: action.payload,
        templateForm: templateToEdit ? { ...templateToEdit } : {},
      }

    case "CANCEL_TEMPLATE_FORM":
      return {
        ...state,
        isCreatingTemplate: false,
        isEditingTemplate: false,
        editingTemplateId: null,
        templateForm: {},
      }

    case "UPDATE_TEMPLATE_FORM":
      return {
        ...state,
        templateForm: {
          ...state.templateForm,
          ...action.payload,
        },
      }

    case "SAVE_CUSTOM_TEMPLATE":
      const newCustomTemplates = [...state.customTemplates, action.payload]
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customTemplates", JSON.stringify(newCustomTemplates))
      }
      return {
        ...state,
        customTemplates: newCustomTemplates,
        isCreatingTemplate: false,
        templateForm: {},
      }

    case "UPDATE_CUSTOM_TEMPLATE":
      const updatedTemplates = state.customTemplates.map((template) =>
        template.id === action.payload.id ? action.payload : template,
      )
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customTemplates", JSON.stringify(updatedTemplates))
      }
      return {
        ...state,
        customTemplates: updatedTemplates,
        isEditingTemplate: false,
        editingTemplateId: null,
        templateForm: {},
      }

    case "DELETE_CUSTOM_TEMPLATE":
      const filteredTemplates = state.customTemplates.filter((template) => template.id !== action.payload)
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customTemplates", JSON.stringify(filteredTemplates))
      }
      return {
        ...state,
        customTemplates: filteredTemplates,
        // Clear selection if deleted template was selected
        selectedTemplate: state.selectedTemplate?.id === action.payload ? null : state.selectedTemplate,
      }

    case "DUPLICATE_TEMPLATE":
      const duplicatedTemplate = {
        ...action.payload,
        id: `custom-${Date.now()}`,
        name: `${action.payload.name} (Copy)`,
        category: "custom" as const,
        isBuiltIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const templatesWithDuplicate = [...state.customTemplates, duplicatedTemplate]
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customTemplates", JSON.stringify(templatesWithDuplicate))
      }
      return {
        ...state,
        customTemplates: templatesWithDuplicate,
      }

    case "LOAD_CUSTOM_TEMPLATES":
      return {
        ...state,
        customTemplates: action.payload,
      }

    default:
      return state
  }
}

interface ProjectContextType {
  state: ProjectState
  dispatch: React.Dispatch<ProjectAction>

  // Helper functions
  applyTemplate: (template: ProjectTemplate) => void
  applyPreset: (name: string, preset: QuickStartPreset) => void
  resetToCustom: () => void
  toggleTechnology: (techId: string) => void
  toggleFeature: (featureId: string) => void
  toggleFolder: (path: string) => void
  setProjectName: (name: string) => void
  setShowTemplates: (show: boolean) => void

  // Template CRUD functions
  startCreatingTemplate: () => void
  startEditingTemplate: (templateId: string) => void
  cancelTemplateForm: () => void
  updateTemplateForm: (updates: Partial<ProjectTemplate>) => void
  saveCustomTemplate: (template: Omit<ProjectTemplate, "id" | "createdAt" | "updatedAt">) => void
  updateCustomTemplate: (template: ProjectTemplate) => void
  deleteCustomTemplate: (templateId: string) => void
  duplicateTemplate: (template: ProjectTemplate) => void
  loadCustomTemplates: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  const applyTemplate = (template: ProjectTemplate) => {
    dispatch({ type: "SET_TEMPLATE", payload: template })
  }

  const applyPreset = (name: string, preset: QuickStartPreset) => {
    dispatch({ type: "SET_PRESET", payload: { name, preset } })
  }

  const resetToCustom = () => {
    dispatch({ type: "RESET_TO_CUSTOM" })
  }

  const toggleTechnology = (techId: string) => {
    dispatch({ type: "TOGGLE_TECHNOLOGY", payload: techId })
  }

  const toggleFeature = (featureId: string) => {
    dispatch({ type: "TOGGLE_FEATURE", payload: featureId })
  }

  const toggleFolder = (path: string) => {
    dispatch({ type: "TOGGLE_FOLDER", payload: path })
  }

  const setProjectName = (name: string) => {
    dispatch({ type: "SET_PROJECT_NAME", payload: name })
  }

  const setShowTemplates = (show: boolean) => {
    dispatch({ type: "SET_SHOW_TEMPLATES", payload: show })
  }

  // Template CRUD functions
  const startCreatingTemplate = () => {
    dispatch({ type: "START_CREATING_TEMPLATE" })
  }

  const startEditingTemplate = (templateId: string) => {
    dispatch({ type: "START_EDITING_TEMPLATE", payload: templateId })
  }

  const cancelTemplateForm = () => {
    dispatch({ type: "CANCEL_TEMPLATE_FORM" })
  }

  const updateTemplateForm = (updates: Partial<ProjectTemplate>) => {
    dispatch({ type: "UPDATE_TEMPLATE_FORM", payload: updates })
  }

  const saveCustomTemplate = (template: Omit<ProjectTemplate, "id" | "createdAt" | "updatedAt">) => {
    const newTemplate: ProjectTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      category: "custom",
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: "SAVE_CUSTOM_TEMPLATE", payload: newTemplate })
  }

  const updateCustomTemplate = (template: ProjectTemplate) => {
    const updatedTemplate = {
      ...template,
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: "UPDATE_CUSTOM_TEMPLATE", payload: updatedTemplate })
  }

  const deleteCustomTemplate = (templateId: string) => {
    dispatch({ type: "DELETE_CUSTOM_TEMPLATE", payload: templateId })
  }

  const duplicateTemplate = (template: ProjectTemplate) => {
    dispatch({ type: "DUPLICATE_TEMPLATE", payload: template })
  }

  const loadCustomTemplates = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customTemplates")
      if (saved) {
        try {
          const templates = JSON.parse(saved)
          dispatch({ type: "LOAD_CUSTOM_TEMPLATES", payload: templates })
        } catch (error) {
          console.error("Failed to load custom templates:", error)
        }
      }
    }
  }

  const contextValue: ProjectContextType = {
    state,
    dispatch,
    applyTemplate,
    applyPreset,
    resetToCustom,
    toggleTechnology,
    toggleFeature,
    toggleFolder,
    setProjectName,
    setShowTemplates,
    startCreatingTemplate,
    startEditingTemplate,
    cancelTemplateForm,
    updateTemplateForm,
    saveCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
    duplicateTemplate,
    loadCustomTemplates,
  }

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
