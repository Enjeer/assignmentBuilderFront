// AppRouter.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EditorPage from "@/pages/EditorPage/EditorPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { setAuthChecked } from "@/features/auth/authSlice";
import { RootState } from "@/app/store";

const AppRouter = () => {
    const dispatch = useDispatch();
    const { isAuthChecked, user } = useSelector((state: RootState) => state.auth);

    // Проверяем localStorage один раз при старте приложения
    useEffect(() => {
        dispatch(setAuthChecked(true));
    }, [dispatch]);

    if (!isAuthChecked) {
        // Можно показать loader пока проверяем auth
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
        <Routes>
            {/* Страница авторизации */}
            <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <AuthPage />}
            />

            {/* Главная защищенная область */}
            <Route
            path="/"
            element={
                <ProtectedRoute>
                <MainLayout />
                </ProtectedRoute>
            }
            >
            <Route index element={<DashboardPage />} />
            <Route path="editor/" element={<ProjectsPage />} />
            <Route path="editor/:documentId" element={<EditorPage />} />
            </Route>

            {/* Любой другой путь */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;