import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {appStore} from "./stores/appStore";
import {userStore} from "./stores/userStore";
import {systemMessagesStore} from "./stores/systemMessagesStore";
import {profileStore} from "./stores/profileStore";
import {friendStore} from "./stores/friendStore";
import {HashRouter} from "react-router-dom";
import {roomStore} from "./stores/roomStore";
import {chatStore} from "./stores/chatStore";

type MainContextType = {
    app: typeof appStore,
    user: typeof userStore,
    messages: typeof systemMessagesStore,
    profile: typeof profileStore,
    friends: typeof friendStore,
    rooms: typeof roomStore,
    chats: typeof chatStore
}
export const MainContext = createContext<MainContextType>({} as MainContextType)

ReactDOM.render(
    <MainContext.Provider value={{
        app: appStore,
        user: userStore,
        messages: systemMessagesStore,
        profile: profileStore,
        friends: friendStore,
        rooms: roomStore,
        chats: chatStore
    }}>
        <HashRouter>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </HashRouter>
    </MainContext.Provider>,
    document.getElementById('root')
);