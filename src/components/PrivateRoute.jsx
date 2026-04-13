import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";




const PrivateRoute =()=>{

    const {token, user} = useSelector((State) => State.auth);

    // if admin not token then return login page
  if (!token) return <Navigate to="/" replace />;
   return <Outlet />;
}

export default PrivateRoute;