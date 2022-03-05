import React, {useContext, useEffect} from 'react';
import {LoginPage} from "./pages/LoginPage";
import {observer} from "mobx-react-lite";
import {MainContext} from "./index";
import AuthController from "./controllers/AuthController";
import {MessageFeed} from "./components/system-message/MessageFeed";
import {useRoutes} from "./Router/useRoutes";

const App = observer(() => {
    const {app} = useContext(MainContext)
    const routes = useRoutes()
    console.log(1)

    useEffect(() => {
        app.appStartLoading()
        AuthController.checkAuth().then(res => app.appEndLoading())
    }, [])

    return (
        <>
            {routes}
            <MessageFeed/>
        </>
    );
})

export default App;