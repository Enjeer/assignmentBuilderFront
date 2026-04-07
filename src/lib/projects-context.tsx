import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "./axios";

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


// const MOCK_PROJECT: Project = {
//   id: "mock-project-001",
//   name: "Искусственный интеллект в современном образовании: трансформация педагогических практик",
//   description: "Исследование влияния генеративных нейросетей на методы преподавания в высшей школе. Анализ кейсов использования ChatGPT, Midjourney и других AI-инструментов в учебном процессе.",
//   type: "diplom",
//   status: "inProgress",
//   updatedAt: new Date().toISOString(),
//   blocks: [
//     {
//       id: "title-page-1",
//       type: "title-page",
//       content: {
//         title: "Искусственный интеллект в современном образовании",
//         subtitle: "Трансформация педагогических практик",
//         author: "Иванов А.С.",
//         date: "2024",
//         institution: "Московский Государственный Университет"
//       }
//     },
//     {
//       id: "chapter-1",
//       type: "chapter",
//       content: {
//         title: "Введение",
//         number: "1",
//         pages: "3-8"
//       }
//     },
//     {
//       id: "text-1",
//       type: "text",
//       content: {
//         body: "Актуальность исследования обусловлена стремительным внедрением технологий искусственного интеллекта во все сферы человеческой деятельности. Образовательная среда не является исключением: за последние два года количество публикаций на тему AI в педагогике выросло на 340%. Цель данной работы — выявить оптимальные стратегии интеграции нейросетевых моделей в учебный процесс без потери академической строгости и критического мышления у студентов.",
//         style: "normal"
//       }
//     },
//     {
//       id: "heading-1",
//       type: "heading",
//       content: {
//         level: 2,
//         text: "1. Теоретические основы применения AI в педагогике"
//       }
//     },
//     {
//       id: "text-2",
//       type: "text",
//       content: {
//         body: "Согласно исследованию Holmes et al. (2023), существуют три парадигмы использования AI в образовании: AI как инструмент оценки (automated grading systems), AI как персональный тьютор (intelligent tutoring systems) и AI как генератор контента (content creation tools). Каждая из этих парадигм требует пересмотра традиционных методик преподавания и разработки новых компетенций как для студентов, так и для преподавателей.",
//         style: "academic"
//       }
//     },
//     {
//       id: "image-1",
//       type: "image",
//       content: {
//         url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
//         caption: "Нейронная сеть, визуализация процесса машинного обучения",
//         alt: "AI neural network visualization",
//         alignment: "center"
//       }
//     },
//     {
//       id: "heading-2",
//       type: "heading",
//       content: {
//         level: 3,
//         text: "1.1 Генеративные модели и их образовательный потенциал"
//       }
//     },
//     {
//       id: "text-3",
//       type: "text",
//       content: {
//         body: "GPT-4 и аналогичные модели демонстрируют способность генерировать учебные материалы, создавать индивидуальные траектории обучения и автоматизировать рутинные задачи преподавателя. Однако ключевой проблемой остается феномен 'галлюцинаций' (hallucinations) — генерация правдоподобной, но фактически неверной информации. Это требует внедрения дополнительных механизмов верификации и развития у студентов навыков критической оценки контента.",
//         style: "normal"
//       }
//     },
//     {
//       id: "image-2",
//       type: "image",
//       content: {
//         url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
//         caption: "Роботизированная рука, взаимодействующая с цифровым интерфейсом — симбиоз человека и AI",
//         alt: "Robot hand touching digital interface",
//         alignment: "center"
//       }
//     },
//     {
//       id: "table-1",
//       type: "table",
//       content: {
//         headers: ["Инструмент", "Применение", "Эффективность (1-10)", "Стоимость"],
//         rows: [
//           ["ChatGPT-4", "Генерация заданий, объяснение тем", "9", "Freemium"],
//           ["Midjourney V6", "Создание визуальных материалов", "8", "10-120$/мес"],
//           ["Grammarly GO", "Проверка стилистики текстов", "7", "12$/мес"],
//           ["Perplexity AI", "Поиск источников с цитатами", "9", "20$/мес"],
//           ["Gamma AI", "Создание презентаций", "8", "Freemium"]
//         ],
//         caption: "Таблица 1 — Сравнительный анализ AI-инструментов для образования"
//       }
//     },
//     {
//       id: "heading-3",
//       type: "heading",
//       content: {
//         level: 2,
//         text: "2. Эмпирическое исследование эффективности AI-ассистентов"
//       }
//     },
//     {
//       id: "text-4",
//       type: "text",
//       content: {
//         body: "В период с сентября по декабрь 2024 года было проведено пилотное исследование с участием 156 студентов и 12 преподавателей МГУ. Экспериментальная группа (n=78) использовала AI-ассистентов при выполнении учебных заданий, контрольная группа (n=78) работала по традиционной методике. Результаты показали повышение скорости выполнения заданий на 47% в экспериментальной группе, однако качество глубокого понимания материала оказалось на 12% ниже без дополнительного педагогического сопровождения.",
//         style: "normal"
//       }
//     },
//     {
//       id: "image-3",
//       type: "image",
//       content: {
//         url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop",
//         caption: "Цифровые технологии и будущее образования — абстрактная визуализация",
//         alt: "Digital education future concept",
//         alignment: "center"
//       }
//     },
//     {
//       id: "text-5",
//       type: "text",
//       content: {
//         body: "Важным открытием стало то, что наиболее эффективной стратегией оказалась гибридная модель: студенты сначала генерируют черновик с помощью AI, затем дорабатывают его вручную, проверяя факты и добавляя собственные аргументы. Такой подход позволяет сочетать скорость машинной обработки с глубиной человеческого анализа.",
//         style: "quote"
//       }
//     },
//     {
//       id: "table-2",
//       type: "table",
//       content: {
//         headers: ["Критерий", "Традиционное обучение", "AI-ассистированное", "Гибридная модель"],
//         rows: [
//           ["Скорость выполнения", "40 мин", "22 мин (-45%)", "28 мин (-30%)"],
//           ["Глубина понимания", "8.2/10", "6.9/10", "8.7/10"],
//           ["Удовлетворенность", "7.1/10", "8.4/10", "9.1/10"],
//           ["Удержание материала", "75%", "62%", "81%"]
//         ],
//         caption: "Таблица 2 — Сравнение эффективности трех педагогических моделей"
//       }
//     },
//     {
//       id: "heading-4",
//       type: "heading",
//       content: {
//         level: 2,
//         text: "Заключение"
//       }
//     },
//     {
//       id: "text-6",
//       type: "text",
//       content: {
//         body: "Искусственный интеллект не заменяет преподавателя, но становится мощным инструментом, требующим осознанного и методически выверенного применения. Ключевые рекомендации: (1) внедрение AI-грамотности в педагогические программы, (2) разработка этических кодексов использования нейросетей, (3) создание открытых образовательных репозиториев с верифицированным AI-контентом. Дальнейшие исследования должны быть направлены на долгосрочное влияние AI-ассистентов на развитие критического мышления и академической честности.",
//         style: "normal"
//       }
//     },
//     {
//       id: "image-4",
//       type: "image",
//       content: {
//         url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=500&fit=crop",
//         caption: "Будущее образования — человек и технологии в гармонии",
//         alt: "Future education technology harmony",
//         alignment: "center"
//       }
//     }
//   ]
// };

// const INITIAL_PROJECTS: Project[] = [MOCK_PROJECT];

const INITIAL_PROJECTS: Project[] = [];

interface ProjectsContextType {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  createProject: (data: Omit<Project, "id" | "updatedAt" | "blocks">) => Promise<Project | undefined>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  updateBlocks: (projectId: string, blocks: Block[]) => Promise<void>;
  downloadProject: (projectId: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const sanitizeProject = useCallback((p: any): Project => {
    if (!p) return p;
    return {
      ...p,
      blocks: Array.isArray(p.blocks) ? p.blocks.filter((b: any) => b !== null && typeof b === 'object') : []
    };
  }, []);

  const getProjects = useCallback(async () => {
    try {
      if (!token) return;
      const response = await api.get('projects/'); 
      const cleanProjects = response.data.map(sanitizeProject);
      setProjects(cleanProjects);
    } catch (error: any) {
      console.error("Failed to fetch projects", error);
    }
  }, [token, sanitizeProject]);

  useEffect(() => {
    if (token) {
      getProjects();
    }
  }, [getProjects, token]);

  const getProject = useCallback((id: string) => projects.find(p => p.id === id), [projects]);

  const createProject = useCallback(async (data: Omit<Project, "id" | "updatedAt" | "blocks">) => {
    try {
      if (!token) return;

      const response = await api.post('projects/', data);
      
      const cleanProject = sanitizeProject(response.data);
      setProjects(prev => [cleanProject, ...prev]);

      return cleanProject;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      const response = await api.patch(`projects/${id}/`, data);
      const cleanProject = sanitizeProject(response.data);
      setProjects(prev => prev.map(p => p.id === id ? cleanProject : p));
    } catch (error) {
      throw error;
    }
  }, [sanitizeProject]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await api.delete(`projects/${id}/`);
      setProjects(prev => prev.filter(p => p !== null && p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }, []);

  const downloadProject = useCallback(async (id: string, name: string) => {
    try{
      const response = await api.get(`projects/${id}/download/`, {
        responseType: 'blob', 
      });
      
      const blob = new Blob([response.data]);
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      link.setAttribute('download', `${name}.docx`); 
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      throw error;
    }
  }, []);

  const updateBlocks = useCallback(async (id: string, blocks: Block[]) => {
    try {
      const validBlocks = blocks.filter(Boolean);
      const response = await api.patch(`projects/${id}/`, { blocks: validBlocks });
      const cleanProject = sanitizeProject(response.data);

      setProjects(prev => prev.map(p => p.id === id ? cleanProject : p));
    } catch (error) {
      console.error("Update blocks failed:", error);
      throw error;
    }
  }, [sanitizeProject]);

  return (
    <ProjectsContext.Provider value={{ projects, getProject, createProject, updateProject, deleteProject, downloadProject, updateBlocks }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be inside ProjectsProvider");
  return ctx;
}
  