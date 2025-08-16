import { ProjectProvider } from "../contexts/ProjectContext"
import ClientPage from "./clientpage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fullstack Project Builder",
  description: "Design, configure, and generate your perfect project scaffold",
}

export default function ServerPage() {
  return (
    <ProjectProvider>
      <ClientPage />
    </ProjectProvider>
  )
}
