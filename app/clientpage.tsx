"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Download,
  Eye,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Settings,
  Code,
  Globe,
  Zap,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Plus,
} from "lucide-react"
import { useProject } from "../contexts/ProjectContext"
import TemplateForm from "../components/TemplateForm"
import { useState } from "react"

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

interface ProjectStructure {
  name: string
  type: "file" | "folder"
  children?: ProjectStructure[]
  content?: string
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

const projectTemplates: ProjectTemplate[] = [
  {
    id: "saas-starter",
    name: "SaaS Starter",
    description: "Complete SaaS application with authentication, payments, and dashboard",
    icon: "🚀",
    category: "saas",
    technologies: ["nextjs", "postgresql", "stripe", "nextauth"],
    features: ["auth", "api", "database-schema", "monitoring", "testing", "cicd"],
    complexity: "advanced",
    estimatedTime: "2-3 weeks",
    useCase: "Perfect for launching subscription-based software products",
    suggestedDocs: [
      "Next.js Documentation - https://nextjs.org/docs",
      "Stripe Integration Guide - https://stripe.com/docs/payments",
      "NextAuth.js Setup - https://next-auth.js.org/getting-started/introduction",
      "Prisma Schema Guide - https://www.prisma.io/docs/concepts/components/prisma-schema",
    ],
    isBuiltIn: true,
  },
  {
    id: "ecommerce-store",
    name: "E-commerce Store",
    description: "Full-featured online store with product catalog and checkout",
    icon: "🛒",
    category: "ecommerce",
    technologies: ["nextjs", "postgresql", "stripe", "vercel-ai"],
    features: ["auth", "api", "database-schema", "performance", "i18n"],
    complexity: "advanced",
    estimatedTime: "3-4 weeks",
    useCase: "Build modern online stores with AI-powered recommendations",
    suggestedDocs: [
      "E-commerce Best Practices - https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency",
      "Stripe Checkout - https://stripe.com/docs/checkout",
      "Product Schema Design - https://schema.org/Product",
      "SEO for E-commerce - https://developers.google.com/search/docs/advanced/ecommerce",
    ],
    isBuiltIn: true,
  },
  {
    id: "blog-cms",
    name: "Blog & CMS",
    description: "Content management system with markdown support and SEO optimization",
    icon: "📝",
    category: "blog",
    technologies: ["nextjs", "supabase", "vercel-ai"],
    features: ["auth", "api", "database-schema", "performance", "i18n", "monitoring"],
    complexity: "intermediate",
    estimatedTime: "1-2 weeks",
    useCase: "Create content-rich websites with AI-assisted writing",
    suggestedDocs: [
      "MDX Documentation - https://mdxjs.com/docs/",
      "Supabase Auth - https://supabase.com/docs/guides/auth",
      "SEO with Next.js - https://nextjs.org/learn/seo/introduction-to-seo",
      "Content Strategy Guide - https://developers.google.com/search/docs/beginner/seo-starter-guide",
    ],
    isBuiltIn: true,
  },
  {
    id: "portfolio-site",
    name: "Portfolio Website",
    description: "Personal portfolio with project showcase and contact forms",
    icon: "🎨",
    category: "portfolio",
    technologies: ["nextjs", "supabase"],
    features: ["api", "performance", "i18n", "monitoring"],
    complexity: "beginner",
    estimatedTime: "3-5 days",
    useCase: "Showcase your work and skills professionally",
    suggestedDocs: [
      "Portfolio Design Tips - https://www.awwwards.com/websites/portfolio/",
      "Contact Form Best Practices - https://uxplanet.org/contact-form-design-best-practices-4b1c5e1b1c8a",
      "Performance Optimization - https://web.dev/performance/",
      "Accessibility Guidelines - https://www.w3.org/WAI/WCAG21/quickref/",
    ],
    isBuiltIn: true,
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    description: "Comprehensive admin panel with analytics and user management",
    icon: "📊",
    category: "dashboard",
    technologies: ["nextjs", "postgresql", "nextauth"],
    features: ["auth", "api", "database-schema", "monitoring", "testing", "realtime"],
    complexity: "advanced",
    estimatedTime: "2-3 weeks",
    useCase: "Manage applications with real-time data and user controls",
    suggestedDocs: [
      "Dashboard Design Patterns - https://uxplanet.org/dashboard-design-patterns-f1a6c5b8b1c8",
      "Data Visualization - https://d3js.org/",
      "Real-time Updates - https://socket.io/docs/v4/",
      "Role-Based Access Control - https://auth0.com/docs/manage-users/access-control/rbac",
    ],
    isBuiltIn: true,
  },
  {
    id: "social-app",
    name: "Social Media App",
    description: "Social platform with posts, comments, and real-time messaging",
    icon: "💬",
    category: "social",
    technologies: ["nextjs", "postgresql", "nextauth"],
    features: ["auth", "api", "database-schema", "realtime", "monitoring", "performance"],
    complexity: "advanced",
    estimatedTime: "4-6 weeks",
    useCase: "Build community platforms and social networks",
    suggestedDocs: [
      "Social Media Architecture - https://engineering.fb.com/2021/03/22/production-engineering/facebook-engineering/",
      "Real-time Messaging - https://socket.io/docs/v4/tutorial/",
      "Content Moderation - https://developers.facebook.com/docs/community-standards/",
      "Scalability Patterns - https://aws.amazon.com/architecture/well-architected/",
    ],
    isBuiltIn: true,
  },
  {
    id: "marketplace",
    name: "Marketplace Platform",
    description: "Multi-vendor marketplace with vendor management and commission tracking",
    icon: "🏪",
    category: "marketplace",
    technologies: ["nextjs", "postgresql", "stripe", "nextauth"],
    features: ["auth", "api", "database-schema", "monitoring", "testing", "performance"],
    complexity: "advanced",
    estimatedTime: "6-8 weeks",
    useCase: "Create platforms where multiple vendors can sell products",
    suggestedDocs: [
      "Marketplace Business Models - https://stripe.com/docs/connect",
      "Multi-tenant Architecture - https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/multi-tenant-architecture.html",
      "Payment Splitting - https://stripe.com/docs/connect/charges",
      "Vendor Onboarding - https://stripe.com/docs/connect/express-accounts",
    ],
    isBuiltIn: true,
  },
]

const quickStartPresets = {
  "Frontend Only": {
    technologies: ["nextjs"],
    features: ["tailwind", "eslint", "prettier", "testing"],
    description: "Static site with modern tooling",
  },
  "Full-Stack Basic": {
    technologies: ["nextjs", "supabase"],
    features: ["auth", "api", "database-schema", "testing"],
    description: "Complete app with database and auth",
  },
  "E-commerce Ready": {
    technologies: ["nextjs", "postgresql", "stripe"],
    features: ["auth", "api", "database-schema", "performance"],
    description: "Online store foundation",
  },
  "AI-Powered App": {
    technologies: ["nextjs", "openai", "supabase"],
    features: ["auth", "api", "database-schema", "monitoring"],
    description: "AI integration with data persistence",
  },
  "Enterprise Grade": {
    technologies: ["nextjs", "postgresql", "nextauth"],
    features: ["auth", "api", "database-schema", "monitoring", "security", "testing", "cicd"],
    description: "Production-ready with all best practices",
  },
}

const technologies: Technology[] = [
  // Frontend
  { id: "react", name: "React", description: "Popular UI library", icon: "⚛️", category: "frontend" },
  { id: "nextjs", name: "Next.js", description: "React framework", icon: "▲", category: "frontend" },
  { id: "vue", name: "Vue.js", description: "Progressive framework", icon: "💚", category: "frontend" },
  { id: "angular", name: "Angular", description: "Platform for web apps", icon: "🅰️", category: "frontend" },
  { id: "svelte", name: "Svelte", description: "Compile-time framework", icon: "🧡", category: "frontend" },

  // Backend
  { id: "nodejs", name: "Node.js", description: "JavaScript runtime", icon: "🟢", category: "backend" },
  { id: "fastapi", name: "FastAPI", description: "Python web framework", icon: "🐍", category: "backend" },
  { id: "django", name: "Django", description: "Python framework", icon: "🎸", category: "backend" },
  { id: "go", name: "Go", description: "Systems language", icon: "🐹", category: "backend" },

  // Database
  { id: "postgresql", name: "PostgreSQL", description: "Relational database", icon: "🐘", category: "database" },
  { id: "mongodb", name: "MongoDB", description: "Document database", icon: "🍃", category: "database" },
  { id: "redis", name: "Redis", description: "In-memory store", icon: "🔴", category: "database" },
  { id: "supabase", name: "Supabase", description: "Backend as a service", icon: "⚡", category: "database" },

  // Authentication
  { id: "nextauth", name: "NextAuth.js", description: "Authentication for Next.js", icon: "🔐", category: "auth" },
  { id: "clerk", name: "Clerk", description: "Complete auth solution", icon: "👤", category: "auth" },
  { id: "auth0", name: "Auth0", description: "Identity platform", icon: "🛡️", category: "auth" },
  { id: "firebase-auth", name: "Firebase Auth", description: "Google's auth service", icon: "🔥", category: "auth" },

  // Payment
  { id: "stripe", name: "Stripe", description: "Payment processing", icon: "💳", category: "payment" },
  { id: "paypal", name: "PayPal", description: "Digital payments", icon: "💰", category: "payment" },
  { id: "lemonsqueezy", name: "Lemon Squeezy", description: "Merchant of record", icon: "🍋", category: "payment" },

  // AI
  { id: "openai", name: "OpenAI", description: "GPT models", icon: "🤖", category: "ai" },
  { id: "anthropic", name: "Anthropic", description: "Claude AI", icon: "🧠", category: "ai" },
  { id: "vercel-ai", name: "Vercel AI SDK", description: "AI toolkit", icon: "✨", category: "ai" },

  // Deployment
  { id: "vercel", name: "Vercel", description: "Frontend deployment", icon: "▲", category: "deployment" },
  { id: "netlify", name: "Netlify", description: "Web platform", icon: "🌐", category: "deployment" },
  { id: "docker", name: "Docker", description: "Containerization", icon: "🐳", category: "deployment" },
]

const projectFeatures: ProjectFeature[] = [
  { id: "auth", name: "Authentication", description: "User login/signup", category: "Security" },
  { id: "api", name: "REST API", description: "RESTful endpoints", category: "Backend" },
  { id: "graphql", name: "GraphQL", description: "Query language", category: "Backend" },
  { id: "testing", name: "Testing Suite", description: "Unit & integration tests", category: "Quality" },
  { id: "eslint", name: "ESLint", description: "Code linting", category: "Quality" },
  { id: "prettier", name: "Prettier", description: "Code formatting", category: "Quality" },
  { id: "tailwind", name: "Tailwind CSS", description: "Utility-first CSS", category: "Styling" },
  { id: "sass", name: "Sass/SCSS", description: "CSS preprocessor", category: "Styling" },
  { id: "storybook", name: "Storybook", description: "Component documentation", category: "Documentation" },
  { id: "swagger", name: "Swagger/OpenAPI", description: "API documentation", category: "Documentation" },
  { id: "docker", name: "Docker", description: "Containerization setup", category: "DevOps" },
  { id: "cicd", name: "CI/CD Pipeline", description: "GitHub Actions workflow", category: "DevOps" },
  {
    id: "env-management",
    name: "Environment Management",
    description: "Environment variables setup",
    category: "DevOps",
  },
  { id: "database-schema", name: "Database Schema", description: "Prisma schema generation", category: "Database" },
  { id: "monitoring", name: "Error Monitoring", description: "Sentry error tracking", category: "Monitoring" },
  { id: "security", name: "Security Headers", description: "CORS, CSP, security middleware", category: "Security" },
  {
    id: "performance",
    name: "Performance Optimization",
    description: "Bundle analysis, caching",
    category: "Performance",
  },
  { id: "i18n", name: "Internationalization", description: "Multi-language support", category: "Localization" },
  { id: "realtime", name: "Real-time Features", description: "WebSocket integration", category: "Real-time" },
]

const getArchitectureSuggestions = (technologies: string[]) => {
  const suggestions = []

  if (technologies.includes("nextjs") && technologies.includes("supabase")) {
    suggestions.push({
      name: "JAMstack with Supabase",
      description: "Static generation with serverless functions and real-time database",
      pattern: "Frontend → API Routes → Supabase → Edge Functions",
    })
  }

  if (technologies.includes("react") && technologies.includes("nodejs") && technologies.includes("postgresql")) {
    suggestions.push({
      name: "Traditional PERN Stack",
      description: "PostgreSQL, Express, React, Node.js full-stack architecture",
      pattern: "React → Express API → PostgreSQL",
    })
  }

  if (technologies.includes("nextjs") && technologies.includes("stripe")) {
    suggestions.push({
      name: "E-commerce SaaS",
      description: "Next.js with integrated payment processing",
      pattern: "Next.js → API Routes → Stripe → Database",
    })
  }

  return suggestions
}

const generateReadme = (projectName: string, technologies: string[], features: string[]) => {
  const techDefinitions = {
    react: "React - A JavaScript library for building user interfaces with component-based architecture",
    nextjs: "Next.js - A React framework with server-side rendering, static generation, and API routes",
    nodejs: "Node.js - JavaScript runtime built on Chrome's V8 engine for server-side development",
    postgresql: "PostgreSQL - Advanced open-source relational database with strong ACID compliance",
    stripe: "Stripe - Complete payment processing platform with developer-friendly APIs",
    nextauth: "NextAuth.js - Complete authentication solution for Next.js applications",
    openai: "OpenAI - AI platform providing GPT models for natural language processing",
    // Add more definitions...
  }

  const selectedTechDefs = technologies
    .filter((tech) => techDefinitions[tech])
    .map((tech) => `- **${technologies.find((t) => t.id === tech)?.name}**: ${techDefinitions[tech]}`)
    .join("\n")

  return `# ${projectName}

A modern fullstack application built with cutting-edge technologies.

## 🚀 Tech Stack

${selectedTechDefs}

## 📋 Features

${features.map((f) => `- ${projectFeatures.find((pf) => pf.id === f)?.name}`).join("\n")}

## 🏗️ Architecture

This project follows modern best practices with:
- Component-based frontend architecture
- RESTful API design
- Database-first approach
- Type-safe development

## 🛠️ Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📚 Documentation

Visit our [documentation](./docs) for detailed setup instructions.
`
}

export default function FullstackProjectBuilder() {
  const {
    state,
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
    deleteCustomTemplate,
    duplicateTemplate,
    loadCustomTemplates,
  } = useProject()

  const {
    selectedTemplate,
    selectedPreset,
    showTemplates,
    projectName,
    selectedTechnologies,
    selectedFeatures,
    expandedFolders,
    customTemplates,
    isCreatingTemplate,
    isEditingTemplate,
  } = state

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  // Load custom templates on mount
  useEffect(() => {
    loadCustomTemplates()
  }, [loadCustomTemplates])

  // All templates (built-in + custom)
  const allTemplates = [...projectTemplates, ...customTemplates]

  // Generate project structure based on current state
  const generateProjectStructure = (): ProjectStructure[] => {
    const structure: ProjectStructure[] = [
      {
        name: projectName,
        type: "folder",
        children: [
          {
            name: "README.md",
            type: "file",
            content: generateReadme(projectName, selectedTechnologies, selectedFeatures),
          },
          {
            name: "package.json",
            type: "file",
            content: JSON.stringify(
              {
                name: projectName,
                version: "1.0.0",
                scripts: {
                  dev: "next dev",
                  build: "next build",
                  start: "next start",
                  lint: "next lint",
                },
                dependencies: {
                  next: "^14.0.0",
                  react: "^18.0.0",
                  "react-dom": "^18.0.0",
                },
              },
              null,
              2,
            ),
          },
        ],
      },
    ]

    // Add Next.js structure if selected
    if (selectedTechnologies.includes("nextjs")) {
      structure[0].children?.push({
        name: "app",
        type: "folder",
        children: [
          {
            name: "page.tsx",
            type: "file",
            content: `export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to ${projectName}</h1>
      <p>Your project is ready to go!</p>
    </main>
  )
}`,
          },
          {
            name: "layout.tsx",
            type: "file",
            content: `import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by Fullstack Project Builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
          },
        ],
      })
    }

    return structure
  }

  const projectStructure = generateProjectStructure()

  const renderProjectTree = (items: ProjectStructure[], path = "") => {
    return items.map((item, index) => {
      const currentPath = path ? `${path}/${item.name}` : item.name
      const isExpanded = expandedFolders.has(currentPath)

      return (
        <div key={index} className="ml-4">
          <div
            className="flex items-center gap-2 py-1 hover:bg-muted/50 rounded cursor-pointer"
            onClick={() => item.type === "folder" && toggleFolder(currentPath)}
          >
            {item.type === "folder" ? (
              <>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Folder className="w-4 h-4 text-blue-500" />
              </>
            ) : (
              <>
                <div className="w-4" />
                <File className="w-4 h-4 text-gray-500" />
              </>
            )}
            <span className="text-sm">{item.name}</span>
          </div>
          {item.type === "folder" && isExpanded && item.children && (
            <div className="ml-2">{renderProjectTree(item.children, currentPath)}</div>
          )}
        </div>
      )
    })
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (templateToDelete) {
      deleteCustomTemplate(templateToDelete)
      setTemplateToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const downloadProject = () => {
    alert("Project download would start here! 🚀")
  }

  const previewProject = () => {
    alert("Live preview would open here! 👀")
  }

  // Show template form if creating or editing
  if (isCreatingTemplate || isEditingTemplate) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <TemplateForm technologies={technologies} projectFeatures={projectFeatures} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fullstack Project Builder</h1>
          <p className="text-muted-foreground">Design, configure, and generate your perfect project scaffold</p>
        </div>

        {showTemplates ? (
          <div className="space-y-8">
            {/* Template Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Choose Your Starting Point
                  </CardTitle>
                  <Button onClick={startCreatingTemplate} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="templates">Built-in Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom Templates ({customTemplates.length})</TabsTrigger>
                    <TabsTrigger value="presets">Quick Start Presets</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projectTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50 relative group"
                        >
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => applyTemplate(template)}>
                                  Use Template
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div onClick={() => applyTemplate(template)}>
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{template.icon}</span>
                                <div>
                                  <CardTitle className="text-lg">{template.name}</CardTitle>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">{template.complexity}</Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      Built-in
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground">{template.description}</p>

                              <div className="space-y-2">
                                <p className="text-xs font-medium">Tech Stack:</p>
                                <div className="flex flex-wrap gap-1">
                                  {template.technologies.slice(0, 3).map((tech) => {
                                    const techData = technologies.find((t) => t.id === tech)
                                    return techData ? (
                                      <Badge key={tech} variant="secondary" className="text-xs">
                                        {techData.icon} {techData.name}
                                      </Badge>
                                    ) : null
                                  })}
                                  {template.technologies.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{template.technologies.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs font-medium">Estimated Time:</p>
                                <p className="text-xs text-muted-foreground">{template.estimatedTime}</p>
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs font-medium">Best For:</p>
                                <p className="text-xs text-muted-foreground">{template.useCase}</p>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-6">
                    {customTemplates.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-semibold mb-2">No Custom Templates Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Create your first custom template to save your favorite configurations
                        </p>
                        <Button onClick={startCreatingTemplate}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Template
                        </Button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customTemplates.map((template) => (
                          <Card
                            key={template.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50 relative group"
                          >
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => applyTemplate(template)}>
                                    Use Template
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => startEditingTemplate(template.id)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => duplicateTemplate(template)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div onClick={() => applyTemplate(template)}>
                              <CardHeader>
                                <div className="flex items-center gap-3">
                                  <span className="text-3xl">{template.icon}</span>
                                  <div>
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="outline">{template.complexity}</Badge>
                                      <Badge variant="default" className="text-xs">
                                        Custom
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">{template.description}</p>

                                <div className="space-y-2">
                                  <p className="text-xs font-medium">Tech Stack:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {template.technologies.slice(0, 3).map((tech) => {
                                      const techData = technologies.find((t) => t.id === tech)
                                      return techData ? (
                                        <Badge key={tech} variant="secondary" className="text-xs">
                                          {techData.icon} {techData.name}
                                        </Badge>
                                      ) : null
                                    })}
                                    {template.technologies.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{template.technologies.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <p className="text-xs font-medium">Estimated Time:</p>
                                  <p className="text-xs text-muted-foreground">{template.estimatedTime}</p>
                                </div>

                                {template.createdAt && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium">Created:</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(template.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="presets" className="mt-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(quickStartPresets).map(([name, preset]) => (
                        <Card
                          key={name}
                          className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                          onClick={() => applyPreset(name, preset)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{name}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">{preset.description}</p>

                            <div className="space-y-2">
                              <p className="text-xs font-medium">Includes:</p>
                              <div className="flex flex-wrap gap-1">
                                {preset.technologies.map((tech) => {
                                  const techData = technologies.find((t) => t.id === tech)
                                  return techData ? (
                                    <Badge key={tech} variant="secondary" className="text-xs">
                                      {techData.icon} {techData.name}
                                    </Badge>
                                  ) : null
                                })}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-medium">Features:</p>
                              <p className="text-xs text-muted-foreground">
                                {preset.features.slice(0, 3).join(", ")}
                                {preset.features.length > 3 && ` +${preset.features.length - 3} more`}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={resetToCustom}>
                    <Settings className="w-4 h-4 mr-2" />
                    Start from Scratch (Custom)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Info Banner */}
              {(selectedTemplate || selectedPreset) && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedTemplate && (
                          <>
                            <span className="text-2xl">{selectedTemplate.icon}</span>
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {selectedTemplate.name} Template
                                {!selectedTemplate.isBuiltIn && (
                                  <Badge variant="default" className="text-xs">
                                    Custom
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                            </div>
                          </>
                        )}
                        {selectedPreset && (
                          <div>
                            <h3 className="font-semibold">{selectedPreset} Preset</h3>
                            <p className="text-sm text-muted-foreground">
                              {quickStartPresets[selectedPreset].description}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {selectedTemplate && !selectedTemplate.isBuiltIn && (
                          <Button variant="outline" size="sm" onClick={() => startEditingTemplate(selectedTemplate.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Template
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                          Change Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Project Configuration
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={startCreatingTemplate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="my-awesome-project"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Technology Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technology Stack
                    {(selectedTemplate || selectedPreset) && (
                      <Badge variant="secondary" className="ml-2">
                        Auto-selected from {selectedTemplate ? "template" : "preset"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="frontend" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="frontend">Frontend</TabsTrigger>
                      <TabsTrigger value="backend">Backend</TabsTrigger>
                      <TabsTrigger value="database">Database</TabsTrigger>
                      <TabsTrigger value="auth">Auth</TabsTrigger>
                      <TabsTrigger value="payment">Payment</TabsTrigger>
                      <TabsTrigger value="ai">AI</TabsTrigger>
                    </TabsList>

                    {["frontend", "backend", "database", "auth", "payment", "ai"].map((category) => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {technologies
                            .filter((tech) => tech.category === category)
                            .map((tech) => (
                              <div
                                key={tech.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedTechnologies.includes(tech.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onClick={() => toggleTechnology(tech.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{tech.icon}</span>
                                  <div>
                                    <h4 className="font-medium">{tech.name}</h4>
                                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Features Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Project Features
                    {(selectedTemplate || selectedPreset) && (
                      <Badge variant="secondary" className="ml-2">
                        Auto-selected from {selectedTemplate ? "template" : "preset"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(
                      projectFeatures.reduce(
                        (acc, feature) => {
                          if (!acc[feature.category]) acc[feature.category] = []
                          acc[feature.category].push(feature)
                          return acc
                        },
                        {} as Record<string, ProjectFeature[]>,
                      ),
                    ).map(([category, features]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                          {category}
                        </h4>
                        <div className="space-y-3">
                          {features.map((feature) => (
                            <div key={feature.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={feature.id}
                                checked={selectedFeatures.includes(feature.id)}
                                onCheckedChange={() => toggleFeature(feature.id)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={feature.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {feature.name}
                                </label>
                                <p className="text-xs text-muted-foreground">{feature.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              {/* Selected Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Stack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedTechnologies.map((techId) => {
                      const tech = technologies.find((t) => t.id === techId)
                      return tech ? (
                        <Badge key={techId} variant="secondary" className="flex items-center gap-1">
                          <span>{tech.icon}</span>
                          {tech.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-wrap gap-2">
                    {selectedFeatures.map((featureId) => {
                      const feature = projectFeatures.find((f) => f.id === featureId)
                      return feature ? (
                        <Badge key={featureId} variant="outline">
                          {feature.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Documentation */}
              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📚 Suggested Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTemplate.suggestedDocs.map((doc, index) => {
                        const [title, url] = doc.split(" - ")
                        return (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <h4 className="font-medium text-sm">{title}</h4>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              {url}
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Architecture Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Suggested Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  {getArchitectureSuggestions(selectedTechnologies).map((arch, index) => (
                    <div key={index} className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm">{arch.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{arch.description}</p>
                      <code className="text-xs bg-background px-2 py-1 rounded">{arch.pattern}</code>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Project Structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Project Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="font-mono text-sm">{renderProjectTree(projectStructure)}</div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-3">
                <Button onClick={previewProject} className="w-full bg-transparent" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Live Preview
                </Button>
                <Button onClick={downloadProject} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Project
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this custom template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
