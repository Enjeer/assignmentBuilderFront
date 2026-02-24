import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DocumentState, Block } from "./types"
import { createTextBlock } from "@/features/blocks/blockFactory"

const initialState: DocumentState = {
    id: "doc-1",
    title: "Новая курсовая",
    standard: "GOST",
    blocks: []
}

const documentSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        addBlock(state, action: PayloadAction<Block>) {
        state.blocks.push(action.payload)
        },

        updateBlock(state, action: PayloadAction<Block>) {
        const index = state.blocks.findIndex(
            b => b.id === action.payload.id
        )
        if (index !== -1) {
            state.blocks[index] = action.payload
        }
        },

        removeBlock(state, action: PayloadAction<string>) {
        state.blocks = state.blocks.filter(
            b => b.id !== action.payload
        )
        },

        setStandard(state, action: PayloadAction<"GOST" | "APA">) {
        state.standard = action.payload
        }
    }
})

export const {
    addBlock,
    updateBlock,
    removeBlock,
    setStandard
} = documentSlice.actions

export default documentSlice.reducer