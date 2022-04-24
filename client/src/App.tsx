import React, {useContext, useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {MainContext} from "./index";
import AuthController from "./controllers/AuthController";
import {MessageFeed} from "./components/system-message/MessageFeed";
import {useRoutes} from "./router/useRoutes";
import ProfileSettingsController from "./controllers/ProfileSettingsController";
import {socketInterface} from "./socket/SocketInterface";

const App = observer(() => {
    const {app, user} = useContext(MainContext)
    const routes = useRoutes()

    useEffect(() => {
        app.appStartLoading()
        AuthController.checkAuth().then(res => app.appEndLoading())
    }, [])

    useEffect(() => {
        const currentScheme = ProfileSettingsController.getCurrentColorScheme()
        ProfileSettingsController.changeColorScheme(currentScheme)
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token && user.isAuth) {
            socketInterface.createSocket(token)
            socketInterface.connect()
        }
        return () => {
            socketInterface.disconnect()
        }
    }, [user.isAuth])

    return (
        <>
            {routes}
            <MessageFeed/>
        </>
    );
})

export default App;