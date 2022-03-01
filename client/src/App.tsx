import React, {useContext, useEffect} from 'react';
import {LoginPage} from "./pages/LoginPage";
import {observer} from "mobx-react-lite";
import {MainContext} from "./index";
import AuthController from "./controllers/AuthController";

const App = observer(() => {
    const {auth, app} = useContext(MainContext)
    useEffect(() => {
        app.appStartLoading()
        AuthController.checkAuth().then(res => app.appEndLoading())
    })

    return (
        <LoginPage/>
    );
})

export default App;