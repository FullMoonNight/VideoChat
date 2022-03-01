import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppStore from "./stores/appStore";
import AuthStore from "./stores/authStore";
import MessagesStore from "./stores/messagesStore";

type MainContextType = {
    app: AppStore,
    auth: AuthStore,
    messages: MessagesStore
}
export const MainContext = createContext<MainContextType>({} as MainContextType)

ReactDOM.render(
    <MainContext.Provider value={{
        app: new AppStore(),
        auth: new AuthStore(),
        messages: new MessagesStore()
    }}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </MainContext.Provider>,
    document.getElementById('root')
);