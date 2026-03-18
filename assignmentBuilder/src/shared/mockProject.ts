import { Project } from "./common"

export const mockProject: Project = {
    id: "doc1",
    name: "Курсач, епта",
    description: "Курсовая работа по истории с анализом текстов XV-XVII вв.",
    type: "course",
    date: "2026-03-18",
    status: "active",
    data: {
        blocks: [
            // Титульный лист
            {
                id: "title1",
                type: "titlePage",
                content: {
                    university: "БГЭУ",
                    faculty: "ФЦЭ",
                    department: "Кафедра Истории",
                    workType: "Курсовая работа",
                    title: "Историческое исследование средневековых манускриптов",
                    studentName: "Иванов Иван",
                    group: "23ИСТ-1",
                    teacherName: "Петрова Елена Сергеевна",
                    city: "Минск",
                    year: "2026",
                },
            },

            // Содержание (можно оформить как отдельный блок)
            {
                id: "toc1",
                type: "chapter",
                name: "Содержание",
                children: [
                    {
                        id: "tocSub1",
                        type: "subChapter",
                        name: "Введение",
                        children: [],
                    },
                    {
                        id: "tocSub2",
                        type: "subChapter",
                        name: "Глава 1: Происхождение манускриптов",
                        children: [],
                    },
                    {
                        id: "tocSub3",
                        type: "subChapter",
                        name: "Глава 2: Структура и содержание",
                        children: [],
                    },
                    {
                        id: "tocSub4",
                        type: "subChapter",
                        name: "Глава 3: Влияние на культуру",
                        children: [],
                    },
                    {
                        id: "tocSub5",
                        type: "subChapter",
                        name: "Заключение",
                        children: [],
                    },
                    {
                        id: "tocSub6",
                        type: "subChapter",
                        name: "Список источников",
                        children: [],
                    },
                ],
            },

            // Глава 1
            {
                id: "chapter1",
                type: "chapter",
                name: "Глава 1: Происхождение манускриптов",
                children: [
                    {
                        id: "sub1-1",
                        type: "subChapter",
                        name: "История создания",
                        children: [
                            {
                                id: "text1-1",
                                type: "text",
                                content: { text: "Манускрипты средневековья создавались вручную, преимущественно монахами в скрипториях..." },
                            },
                            {
                                id: "image1-1",
                                type: "image",
                                content: { imageUrl: "/img/manuscript1.png", caption: "Скрипторий XIV века" },
                            },
                        ],
                    },
                    {
                        id: "sub1-2",
                        type: "subChapter",
                        name: "Материалы и технологии",
                        children: [
                            {
                                id: "text1-2",
                                type: "text",
                                content: { text: "Использовалась пергаментная бумага, чернила из растительных и минеральных компонентов..." },
                            },
                            {
                                id: "image1-2",
                                type: "image",
                                content: { imageUrl: "/img/ink.png", caption: "Пример приготовления чернил" },
                            },
                        ],
                    },
                    {
                        id: "sub1-3",
                        type: "subChapter",
                        name: "Сохранность и хранение",
                        children: [
                            {
                                id: "text1-3",
                                type: "text",
                                content: { text: "Многие манускрипты дошли до наших дней благодаря хранению в монастырских библиотеках и коллекциях..." },
                            },
                        ],
                    },
                ],
            },

            // Глава 2
            {
                id: "chapter2",
                type: "chapter",
                name: "Глава 2: Структура и содержание",
                children: [
                    {
                        id: "sub2-1",
                        type: "subChapter",
                        name: "Основные жанры",
                        children: [
                            {
                                id: "text2-1",
                                type: "text",
                                content: { text: "Манускрипты делились на религиозные, научные, художественные и юридические тексты..." },
                            },
                            {
                                id: "image2-1",
                                type: "image",
                                content: { imageUrl: "/img/genre.png", caption: "Категории манускриптов" },
                            },
                        ],
                    },
                    {
                        id: "sub2-2",
                        type: "subChapter",
                        name: "Организация текста",
                        children: [
                            {
                                id: "text2-2",
                                type: "text",
                                content: { text: "Текст часто делился на главы, подглавы, иллюстрировался миниатюрами и маргиналиями..." },
                            },
                        ],
                    },
                    {
                        id: "sub2-3",
                        type: "subChapter",
                        name: "Иллюстрации и миниатюры",
                        children: [
                            {
                                id: "text2-3",
                                type: "text",
                                content: { text: "Миниатюры помогали визуализировать содержание и украшали страницы..." },
                            },
                            {
                                id: "image2-2",
                                type: "image",
                                content: { imageUrl: "/img/miniature.png", caption: "Миниатюра из XV века" },
                            },
                        ],
                    },
                ],
            },

            // Глава 3
            {
                id: "chapter3",
                type: "chapter",
                name: "Глава 3: Влияние на культуру",
                children: [
                    {
                        id: "sub3-1",
                        type: "subChapter",
                        name: "Распространение знаний",
                        children: [
                            {
                                id: "text3-1",
                                type: "text",
                                content: { text: "Манускрипты были основным способом передачи знаний до изобретения печатного станка..." },
                            },
                        ],
                    },
                    {
                        id: "sub3-2",
                        type: "subChapter",
                        name: "Эстетическое влияние",
                        children: [
                            {
                                id: "text3-2",
                                type: "text",
                                content: { text: "Иллюстрации и каллиграфия манускриптов повлияли на развитие изобразительного искусства и шрифта..." },
                            },
                            {
                                id: "image3-1",
                                type: "image",
                                content: { imageUrl: "/img/art.png", caption: "Средневековое искусство" },
                            },
                        ],
                    },
                    {
                        id: "sub3-3",
                        type: "subChapter",
                        name: "Сохранение культурного наследия",
                        children: [
                            {
                                id: "text3-3",
                                type: "text",
                                content: { text: "Коллекции манускриптов сегодня являются ценнейшими источниками для историков и филологов..." },
                            },
                        ],
                    },
                ],
            },

            // Заключение
            {
                id: "conclusion1",
                type: "chapter",
                name: "Заключение",
                children: [
                    {
                        id: "subConclusion1",
                        type: "subChapter",
                        name: "Выводы",
                        children: [
                            {
                                id: "textConclusion1",
                                type: "text",
                                content: { text: "Манускрипты являются важнейшим источником исторической информации и искусства..." },
                            },
                        ],
                    },
                ],
            },

            // Список источников
            {
                id: "sources1",
                type: "chapter",
                name: "Список источников",
                children: [
                    {
                        id: "subSources1",
                        type: "subChapter",
                        name: "Книги и статьи",
                        children: [
                            {
                                id: "textSource1",
                                type: "text",
                                content: { text: "1. Иванов И. История средневековых манускриптов. Минск, 2018" },
                            },
                            {
                                id: "textSource2",
                                type: "text",
                                content: { text: "2. Петров С. Манускрипты и культура. Москва, 2020" },
                            },
                            {
                                id: "textSource3",
                                type: "text",
                                content: { text: "3. Smith J. Medieval Manuscripts. London, 2017" },
                            },
                        ],
                    },
                ],
            },
        ],
    },
}