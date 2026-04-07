import { Block } from "../types"
import { TextBlock } from "@/features/blocks/components/TextBlock"
import { TitleBlock } from "@/features/blocks/components/TitleBlock"

interface Props {
    block: Block
}

export const BlockRenderer = ({ block }: Props) => {
    switch (block.type) {
        case "text":
        return <TextBlock block={block} />

        case "title":
        return <TitleBlock block={block} />

        default:
        return null
    }
}