import React from "react"
import { useParams } from "react-router-dom"

export default function EditorPage() {
    const { documentId } = useParams<{ documentId: string }>()
    return (
        <div>
        <h1>Editor Page</h1>
        <p>Document ID: {documentId}</p>
        </div>
    )
}