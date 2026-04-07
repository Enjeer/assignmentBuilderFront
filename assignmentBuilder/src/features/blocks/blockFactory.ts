import { nanoid } from "@reduxjs/toolkit"
import { TextBlock, TitleBlock } from "../document/types"

export const createTextBlock = (): TextBlock => ({
    id: nanoid(),
    type: "text",
    content: ""
})

export const createTitleBlock = (): TitleBlock => ({
    id: nanoid(),
    type: "title",
    level: 1,
    content: "Новый заголовок"
})