import React from "react"
import { Outlet, Link } from "react-router-dom"

export default function MainLayout() {
    return (
        <div className="app-container">
        <header className="app-header">
            <nav>
            <Link to="/">Dashboard</Link> |{" "}
            <Link to="/editor/new">New Document</Link>
            </nav>
        </header>

        <aside className="app-sidebar">
            {/* Можно сюда добавить блоки навигации, recent docs, стандартные инструменты */}
            Sidebar
        </aside>

        <main className="app-content">
            {/* Outlet подставляет текущую страницу */}
            <Outlet />
        </main>
        </div>
    )
}