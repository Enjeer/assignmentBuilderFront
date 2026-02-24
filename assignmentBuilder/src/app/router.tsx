import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import EditorPage from "../pages/EditorPage"
import AuthPage from "../pages/AuthPage"
import DashboardPage from "../pages/DashboardPage"
import MainLayout from "../layouts/MainLayout"

// Простая проверка авторизации
const isAuthenticated = () => {
    // TODO: заменить на реальный state из Redux или localStorage
    return !!localStorage.getItem("token")
}

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated()) return <Navigate to="/auth" replace />
    return children
}

const AppRouter = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
            path="/"
            element={
                <ProtectedRoute>
                <MainLayout />
                </ProtectedRoute>
            }
            >
            <Route index element={<DashboardPage />} />
            <Route path="editor/:documentId" element={<EditorPage />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter