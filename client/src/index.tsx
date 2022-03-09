import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {appStore} from "./stores/appStore";
import {userStore} from "./stores/userStore";
import {messagesStore} from "./stores/messagesStore";
import {HashRouter} from "react-router-dom";

type MainContextType = {
    app: typeof appStore,
    user: typeof userStore,
    messages: typeof messagesStore
}
export const MainContext = createContext<MainContextType>({} as MainContextType)

ReactDOM.render(
    <MainContext.Provider value={{
        app: appStore,
        user: userStore,
        messages: messagesStore
    }}>
        <HashRouter>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </HashRouter>
    </MainContext.Provider>,
    document.getElementById('root')
);