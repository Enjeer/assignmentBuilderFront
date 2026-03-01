import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, isAuthChecked } = useSelector((state: RootState) => state.auth);

    if (!isAuthChecked) return null;

    if (!user) return <Navigate to="/auth" replace />;

    return children;
};

export default ProtectedRoute;