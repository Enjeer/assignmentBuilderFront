import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EditorPage from "@/pages/EditorPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectsPage from "@/pages/ProjectsPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/app/protectedRoute";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import {setUser, clearUser, setAuthChecked} from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { auth } from "@/firebaseConfig";

const AppRouter = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                dispatch(setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email!,
                }));
            } else {
                dispatch(clearUser());
            }

            dispatch(setAuthChecked(true));
        });

        return () => unsubscribe();
    }, [dispatch]);


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
            <Route path="editor/" element={<ProjectsPage />} />
            <Route path="editor/:documentId" element={<EditorPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;