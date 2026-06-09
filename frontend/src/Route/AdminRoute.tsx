import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export function AdminRoute({children}: {children: React.ReactNode}) {

    const context = useContext(AuthContext);
    if (!context) return (<p>오류가 발생하였습니다</p>)
    const {user} = context;

    if (!user) {
        return <Navigate to="/login" replace />
    }
    if (user.role === "admin") {
        return <>{children}</>
    } else {
        return <Navigate to="/" replace />
    }
}

export default AdminRoute
