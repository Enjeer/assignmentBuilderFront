export type Project = {
    id: string
    name: string
    description: string
    type: "course" | "lab" | "essay" | "diplom" | "ref"
    date: string
    status: "active" | "inProgress" | "done"

    data: {
        blocks: Block[]
    }
}

export type Block =
    | TitlePageBlock
    | ChapterBlock
    | SubChapterBlock
    | TextBlock
    | ImageBlock
    // | SourceBlock

export type TitlePageBlock = {
    id: string
    type: "titlePage"
    content: {
        university: string
        faculty?: string
        department?: string

        workType: string
        title: string

        studentName: string
        group?: string

        teacherName?: string

        city: string
        year: string
    }
}

export type ChapterBlock = {
    id: string
    type: "chapter"
    name: string
    children: Block[]
}

export type SubChapterBlock = {
    id: string
    type: "subChapter"
    name: string
    children: Block[]
}

export type TextBlock = {
    id: string
    type: "text"
    content: {
        text: string
    }
}

export type ImageBlock = {
    id: string
    type: "image"
    content: {
        imageUrl: string
        caption?: string
    }
}