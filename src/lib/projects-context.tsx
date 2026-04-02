import React, { createContext, useContext, useState, useCallback } from "react";

export interface Block {
  id: string;
  type: "title-page" | "chapter" | "text" | "heading" | "image" | "table";
  content: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: "course" | "essay" | "lab" | "diplom";
  status: "active" | "inProgress" | "done";
  updatedAt: string;
  blocks: Block[];
}

const TYPE_LABELS: Record<string, string> = {
  course: "Курсовая",
  essay: "Эссе",
  lab: "Лабораторная",
  diplom: "Дипломная",
};

export function getTypeLabel(type: string) {
  return TYPE_LABELS[type] || type;
}

const INITIAL_PROJECTS: Project[] = [];

interface ProjectsContextType {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  createProject: (data: Omit<Project, "id" | "updatedAt" | "blocks">) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateBlocks: (projectId: string, blocks: Block[]) => void;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const getProject = useCallback((id: string) => projects.find(p => p.id === id), [projects]);

  const createProject = useCallback((data: Omit<Project, "id" | "updatedAt" | "blocks">) => {
    const p: Project = { ...data, id: crypto.randomUUID(), updatedAt: new Date().toISOString().slice(0, 10), blocks: [] };
    setProjects(prev => [p, ...prev]);
    return p;
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().slice(0, 10) } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateBlocks = useCallback((projectId: string, blocks: Block[]) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, blocks, updatedAt: new Date().toISOString().slice(0, 10) } : p));
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, getProject, createProject, updateProject, deleteProject, updateBlocks }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be inside ProjectsProvider");
  return ctx;
}
