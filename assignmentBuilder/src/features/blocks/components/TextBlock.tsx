import { TextBlock as TextBlockType } from "../../document/types"
import { useAppDispatch } from "@/app/hooks"
import { updateBlock } from "../../document/documentSlice"

interface Props {
    block: TextBlockType
}

export const TextBlock = ({ block }: Props) => {
    const dispatch = useAppDispatch()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(
        updateBlock({
            ...block,
            content: e.target.value
        })
        )
    }

    return (
        <textarea
        value={block.content}
        onChange={handleChange}
        />
    )
}