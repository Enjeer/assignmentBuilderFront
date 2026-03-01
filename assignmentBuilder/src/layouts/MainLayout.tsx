import React from "react"
import { Outlet, Link } from "react-router-dom"
import { logout } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store";

export default function MainLayout() {
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    const logoutHandler = async () => {
        await dispatch(logout());
    }

    return (
        <div className="app-container">
        <header className="app-header">
            <nav>
            <Link to="/">Dashboard</Link> |{" "}
            <Link to="/editor/new">New Document</Link>
            <button onClick={logoutHandler}></button>
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