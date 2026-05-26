import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";


function LoginRoute({children}: {children: React.ReactNode}) {

   const context = useContext(AuthContext);
   if (!context) return (<p>오류가 발생하였습니다</p>)
    const {user} = context;
   if (!user) {
    return <Navigate to="/login" replace />
   } else {
    return <>{children}</>
   }
}

export default LoginRoute
