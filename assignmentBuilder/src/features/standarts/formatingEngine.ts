import { DocumentState } from "../document/types"

export const applyStandard = (
    document: DocumentState
): DocumentState => {
    if (document.standard === "GOST") {
        return {
        ...document,
        blocks: document.blocks.map(block => {
            if (block.type === "title") {
            return {
                ...block,
                content: block.content.toUpperCase()
            }
            }
            return block
        })
        }
    }

    return document
}