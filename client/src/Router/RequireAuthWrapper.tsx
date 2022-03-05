import React, {useContext} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {MainContext} from "../index";

const RequireAuthWrapper = ({children}: { children: JSX.Element }) => {
    const {auth} = useContext(MainContext)
    const location = useLocation()

    if (!auth.isAuth) {
        return <Navigate to='/' state={{from: location}} replace/>
    }

    return children
}

export default RequireAuthWrapper