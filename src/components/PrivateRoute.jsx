import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";




const PrivateRoute =()=>{

    const {token} = useSelector((State) => State.auth);

    // if admin not token then return login page
  return token ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;