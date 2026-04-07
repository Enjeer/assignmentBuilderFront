import { useAppSelector } from "@/app/hooks"
import { BlockRenderer } from "./BlockRenderer"

export const DocumentEditor = () => {
    const blocks = useAppSelector(
        state => state.document.blocks
    )

    return (
        <div>
        {blocks.map(block => (
            <BlockRenderer
            key={block.id}
            block={block}
            />
        ))}
        </div>
    )
}