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

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1", name: "Исследование средневековых манускриптов",
    description: "Анализ исторических текстов XV-XVII вв.",
    type: "course", status: "active", updatedAt: "2026-03-28",
    blocks: [
      { id: "b1", type: "title-page", content: { university: "БГЭУ", title: "Исследование средневековых манускриптов", studentName: "Иванов Иван", group: "23ИСТ-1", teacherName: "Петрова Е.С.", city: "Минск", year: "2026" } },
      { id: "b2", type: "heading", content: { text: "Введение", level: 1 } },
      { id: "b3", type: "text", content: { text: "Данная работа посвящена исследованию средневековых манускриптов и их влиянию на развитие культуры." } },
      { id: "b4", type: "heading", content: { text: "Глава 1: Происхождение манускриптов", level: 1 } },
      { id: "b5", type: "text", content: { text: "Средневековые манускрипты представляют собой уникальные источники информации о жизни и культуре прошлых эпох. Их изучение позволяет глубже понять исторические процессы." } },
    ],
  },
  {
    id: "2", name: "Эволюция социальных сетей",
    description: "Сравнительное исследование платформ",
    type: "essay", status: "done", updatedAt: "2026-03-25",
    blocks: [
      { id: "b6", type: "heading", content: { text: "Эволюция социальных сетей", level: 1 } },
      { id: "b7", type: "text", content: { text: "Социальные сети прошли долгий путь развития от простых форумов до сложных мультимедийных платформ." } },
    ],
  },
  {
    id: "3", name: "Опыт по термодинамике",
    description: "Изучение закономерностей теплопередачи",
    type: "lab", status: "inProgress", updatedAt: "2026-03-30",
    blocks: [
      { id: "b8", type: "heading", content: { text: "Лабораторная работа: Термодинамика", level: 1 } },
      { id: "b9", type: "text", content: { text: "Цель работы: изучить закономерности теплопередачи в различных средах." } },
    ],
  },
  {
    id: "4", name: "Современная литература XXI века",
    description: "Анализ произведений и литературных течений",
    type: "essay", status: "active", updatedAt: "2026-03-27",
    blocks: [],
  },
  {
    id: "5", name: "Программирование на Python",
    description: "Разработка небольшого приложения",
    type: "course", status: "inProgress", updatedAt: "2026-03-29",
    blocks: [],
  },
  {
    id: "6", name: "Кибербезопасность",
    description: "Анализ угроз и защита данных",
    type: "course", status: "inProgress", updatedAt: "2026-03-31",
    blocks: [],
  },
];

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
