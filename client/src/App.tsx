import React, {useContext, useEffect} from 'react';
import {LoginPage} from "./pages/LoginPage";
import {observer} from "mobx-react-lite";
import {MainContext} from "./index";
import AuthController from "./controllers/AuthController";
import {MessageFeed} from "./components/system-message/MessageFeed";
import {useRoutes} from "./router/useRoutes";
import ProfileSettingsController from "./controllers/ProfileSettingsController";

const App = observer(() => {
    const {app} = useContext(MainContext)
    const routes = useRoutes()

    useEffect(() => {
        app.appStartLoading()
        AuthController.checkAuth().then(res => app.appEndLoading())
    }, [])

    useEffect(() => {
        const currentScheme = ProfileSettingsController.getCurrentColorScheme()
        ProfileSettingsController.changeColorScheme(currentScheme)
    }, [])

    return (
        <>
            {routes}
            <MessageFeed/>
        </>
    );
})

export default App;