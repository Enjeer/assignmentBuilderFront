import React from "react"
import { useParams } from "react-router-dom"

export default function DashboardPage() {
    const { documentId } = useParams<{ documentId: string }>()
    return (
        <div>
        <h1>Dashboard Page</h1>
        </div>
    )
}