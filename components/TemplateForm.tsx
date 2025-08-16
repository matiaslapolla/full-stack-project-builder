"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Save, ArrowLeft } from "lucide-react"
import { useProject } from "../contexts/ProjectContext"

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
}

interface TemplateFormProps {
  technologies: Technology[]
  projectFeatures: ProjectFeature[]
}

const iconOptions = ["🚀", "🛒", "📝", "🎨", "📊", "💬", "🏪", "⚡", "🔥", "💎", "🌟", "🎯", "🔧", "📱", "💻", "🎮"]

const complexityOptions = [
  { value: "beginner", label: "Beginner", description: "Simple setup, minimal configuration" },
  { value: "intermediate", label: "Intermediate", description: "Moderate complexity, some advanced features" },
  { value: "advanced", label: "Advanced", description: "Complex setup, enterprise-grade features" },
]

export default function TemplateForm({ technologies, projectFeatures }: TemplateFormProps) {
  const { state, cancelTemplateForm, updateTemplateForm, saveCustomTemplate, updateCustomTemplate } = useProject()

  const { templateForm, isCreatingTemplate, isEditingTemplate } = state
  const [newDocUrl, setNewDocUrl] = useState("")

  const handleSave = () => {
    if (!templateForm.name || !templateForm.description) {
      alert("Please fill in all required fields")
      return
    }

    const template = {
      name: templateForm.name!,
      description: templateForm.description!,
      icon: templateForm.icon || "🚀",
      category: templateForm.category || "custom",
      technologies: templateForm.technologies || [],
      features: templateForm.features || [],
      complexity: templateForm.complexity || "intermediate",
      estimatedTime: templateForm.estimatedTime || "1-2 weeks",
      useCase: templateForm.useCase || "",
      suggestedDocs: templateForm.suggestedDocs || [],
      isBuiltIn: false,
    }

    if (isCreatingTemplate) {
      saveCustomTemplate(template)
    } else if (isEditingTemplate && templateForm.id) {
      updateCustomTemplate({
        ...template,
        id: templateForm.id,
        createdAt: templateForm.createdAt!,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const addDocumentation = () => {
    if (newDocUrl.trim()) {
      const currentDocs = templateForm.suggestedDocs || []
      updateTemplateForm({
        suggestedDocs: [...currentDocs, newDocUrl.trim()],
      })
      setNewDocUrl("")
    }
  }

  const removeDocumentation = (index: number) => {
    const currentDocs = templateForm.suggestedDocs || []
    updateTemplateForm({
      suggestedDocs: currentDocs.filter((_, i) => i !== index),
    })
  }

  const toggleTechnology = (techId: string) => {
    const currentTechs = templateForm.technologies || []
    const newTechs = currentTechs.includes(techId)
      ? currentTechs.filter((id) => id !== techId)
      : [...currentTechs, techId]
    updateTemplateForm({ technologies: newTechs })
  }

  const toggleFeature = (featureId: string) => {
    const currentFeatures = templateForm.features || []
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((id) => id !== featureId)
      : [...currentFeatures, featureId]
    updateTemplateForm({ features: newFeatures })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={cancelTemplateForm}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{isCreatingTemplate ? "Create Custom Template" : "Edit Template"}</h2>
            <p className="text-muted-foreground">
              {isCreatingTemplate
                ? "Create a reusable template from your current configuration"
                : "Modify your custom template"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={cancelTemplateForm}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isCreatingTemplate ? "Create Template" : "Update Template"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name *</Label>
                  <Input
                    id="template-name"
                    value={templateForm.name || ""}
                    onChange={(e) => updateTemplateForm({ name: e.target.value })}
                    placeholder="My Awesome Template"
                  />
                </div>
                <div>
                  <Label htmlFor="template-icon">Icon</Label>
                  <Select
                    value={templateForm.icon || "🚀"}
                    onValueChange={(value) => updateTemplateForm({ icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          <span className="text-lg mr-2">{icon}</span>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="template-description">Description *</Label>
                <Textarea
                  id="template-description"
                  value={templateForm.description || ""}
                  onChange={(e) => updateTemplateForm({ description: e.target.value })}
                  placeholder="Describe what this template is for and what it includes..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="template-use-case">Use Case</Label>
                <Textarea
                  id="template-use-case"
                  value={templateForm.useCase || ""}
                  onChange={(e) => updateTemplateForm({ useCase: e.target.value })}
                  placeholder="When should developers use this template? What problems does it solve?"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-complexity">Complexity</Label>
                  <Select
                    value={templateForm.complexity || "intermediate"}
                    onValueChange={(value) => updateTemplateForm({ complexity: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {complexityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="template-time">Estimated Time</Label>
                  <Input
                    id="template-time"
                    value={templateForm.estimatedTime || ""}
                    onChange={(e) => updateTemplateForm({ estimatedTime: e.target.value })}
                    placeholder="1-2 weeks"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  technologies.reduce(
                    (acc, tech) => {
                      if (!acc[tech.category]) acc[tech.category] = []
                      acc[tech.category].push(tech)
                      return acc
                    },
                    {} as Record<string, Technology[]>,
                  ),
                ).map(([category, techs]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {techs.map((tech) => (
                        <div
                          key={tech.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            (templateForm.technologies || []).includes(tech.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => toggleTechnology(tech.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{tech.icon}</span>
                            <div>
                              <h5 className="font-medium text-sm">{tech.name}</h5>
                              <p className="text-xs text-muted-foreground">{tech.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Project Features</CardTitle>
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
                            id={`template-${feature.id}`}
                            checked={(templateForm.features || []).includes(feature.id)}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`template-${feature.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
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

          {/* Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newDocUrl}
                  onChange={(e) => setNewDocUrl(e.target.value)}
                  placeholder="Documentation Title - https://example.com/docs"
                  onKeyPress={(e) => e.key === "Enter" && addDocumentation()}
                />
                <Button onClick={addDocumentation} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {(templateForm.suggestedDocs || []).length > 0 && (
                <div className="space-y-2">
                  {(templateForm.suggestedDocs || []).map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">{doc}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeDocumentation(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{templateForm.icon || "🚀"}</span>
                  <div>
                    <h3 className="font-semibold">{templateForm.name || "Template Name"}</h3>
                    <Badge variant="outline">{templateForm.complexity || "intermediate"}</Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {templateForm.description || "Template description will appear here..."}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-medium">Tech Stack:</p>
                  <div className="flex flex-wrap gap-1">
                    {(templateForm.technologies || []).slice(0, 4).map((techId) => {
                      const tech = technologies.find((t) => t.id === techId)
                      return tech ? (
                        <Badge key={techId} variant="secondary" className="text-xs">
                          {tech.icon} {tech.name}
                        </Badge>
                      ) : null
                    })}
                    {(templateForm.technologies || []).length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{(templateForm.technologies || []).length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium">Estimated Time:</p>
                  <p className="text-xs text-muted-foreground">{templateForm.estimatedTime || "1-2 weeks"}</p>
                </div>

                {templateForm.useCase && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Best For:</p>
                    <p className="text-xs text-muted-foreground">{templateForm.useCase}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <p className="text-xs font-medium">Selected Features ({(templateForm.features || []).length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {(templateForm.features || []).slice(0, 6).map((featureId) => {
                      const feature = projectFeatures.find((f) => f.id === featureId)
                      return feature ? (
                        <Badge key={featureId} variant="outline" className="text-xs">
                          {feature.name}
                        </Badge>
                      ) : null
                    })}
                    {(templateForm.features || []).length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{(templateForm.features || []).length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
