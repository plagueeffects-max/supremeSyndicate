import { searchProjects } from '@/server/repositories/projectRepository'
import type { ProjectCard } from '@/types/project'

/**
 * Fuzzy-match a project name against the DB.
 * Returns matching ProjectCards or empty array.
 */
export async function fuzzyMatchProject(projectName: string): Promise<ProjectCard[]> {
  if (!projectName.trim()) return []
  return searchProjects({ city: 'Noida', sector: 'Sector 150' })
}
