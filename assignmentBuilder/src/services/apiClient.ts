import { Project } from "@/shared/types/common"

const mockProjects: Project[] = [
    { id: "project1", name: "Исследование древних манускриптов", description: "Анализ исторических текстов Средневековья", type: "course", date: "2024-03-01", status: "active", data: {blocks: []} },
    { id: "project2", name: "Эволюция социальных сетей", description: "Сравнительное исследование Facebook и TikTok", type: "essay", date: "2024-02-27", status: "done", data: {blocks: []} },
    { id: "project3", name: "Опыт по термодинамике", description: "Изучение закономерностей теплопередачи", type: "lab", date: "2024-03-05", status: "inProgress", data: {blocks: []} },
    { id: "project4", name: "Современная литература", description: "Анализ произведений XXI века", type: "essay", date: "2024-02-28", status: "active", data: {blocks: []} },
    { id: "project5", name: "История Олимпийских игр", description: "Сравнение древних и современных игр", type: "course", date: "2024-03-03", status: "done", data: {blocks: []} },
    { id: "project6", name: "Исследование фотосинтеза", description: "Экспериментальные данные по растениям", type: "lab", date: "2024-03-06", status: "inProgress", data: {blocks: []} },
    { id: "project7", name: "Анализ политических систем", description: "Сравнение демократии и авторитаризма", type: "essay", date: "2024-03-02", status: "active", data: {blocks: []} },
    { id: "project8", name: "Культурное наследие городов", description: "Документирование памятников архитектуры", type: "diplom", date: "2024-02-25", status: "done", data: {blocks: []} },
    { id: "project9", name: "Программирование на Python", description: "Разработка небольшого приложения", type: "course", date: "2024-03-07", status: "inProgress", data: {blocks: []} },
    { id: "project10", name: "Психология мотивации", description: "Обзор теорий и эксперименты", type: "essay", date: "2024-02-26", status: "done", data: {blocks: []} },
    { id: "project11", name: "Электромагнитные волны", description: "Практические измерения и расчёты", type: "lab", date: "2024-03-08", status: "inProgress", data: {blocks: []} },
    { id: "project12", name: "История музыки", description: "От барокко до современности", type: "course", date: "2024-03-04", status: "active", data: {blocks: []} },
    { id: "project13", name: "Экология городов", description: "Исследование загрязнения воздуха", type: "essay", date: "2024-03-01", status: "done", data: {blocks: []} },
    { id: "project14", name: "Анализ данных по климату", description: "Обработка температурных рядов", type: "lab", date: "2024-03-09", status: "inProgress", data: {blocks: []} },
    { id: "project15", name: "Философские концепции счастья", description: "Сравнение разных школ мысли", type: "essay", date: "2024-02-24", status: "active", data: {blocks: []} },
    { id: "project16", name: "Разработка веб-приложения", description: "Frontend + Backend проект", type: "course", date: "2024-03-10", status: "inProgress", data: {blocks: []} },
    { id: "project17", name: "Археологические раскопки", description: "Документирование находок", type: "diplom", date: "2024-02-22", status: "done", data: {blocks: []} },
    { id: "project18", name: "Физика жидкостей", description: "Лабораторные эксперименты по гидродинамике", type: "lab", date: "2024-03-11", status: "inProgress", data: {blocks: []} },
    { id: "project19", name: "Социальные медиа и подростки", description: "Влияние на психику и поведение", type: "essay", date: "2024-02-23", status: "active", data: {blocks: []} },
    { id: "project20", name: "Кибербезопасность", description: "Анализ угроз и защита данных", type: "course", date: "2024-03-12", status: "inProgress", data: {blocks: []} },
]

export const apiClient = {
    getProjects: (): Promise<Project[]> => {
        return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockProjects)
        }, 500) // эмулируем задержку сети
        })
    },

    deleteProject: (id: string): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true })
        }, 300)
        })
    },

    createProject: (data: any): Promise<{ success: boolean }> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({success: true});
            }, 500);
        })
    }
}