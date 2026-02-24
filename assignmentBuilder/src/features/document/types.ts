export type BlockType =
    | "title"
    | "text"
    | "image"
    | "table"

export interface BaseBlock {
    id: string
    type: BlockType
}

export interface TitleBlock extends BaseBlock {
    type: "title"
    level: 1 | 2 | 3
    content: string
}

export interface TextBlock extends BaseBlock {
    type: "text"
    content: string
}

export type Block =
    | TitleBlock
    | TextBlock

export interface DocumentState {
    id: string
    title: string
    standard: "GOST" | "APA"
    blocks: Block[]
}