import React, {createContext, CSSProperties, useState} from 'react';
import {MainView} from "../components/main-view/MainView";

interface WinContext {
    setContextWindow: (window: JSX.Element | null) => void,
}

export const WinContext = createContext<WinContext>({} as WinContext)

export const MainViewPage = () => {
    const [ContextWindow, setContextWindow] = useState<JSX.Element | null>(null)

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#00000000",
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    } as CSSProperties

    const closeHandler = (e: any) => {
        if (e.target.dataset.element !== 'close-wrapper') return
        setContextWindow(null)
    }

    return (
        <WinContext.Provider value={{setContextWindow}}>
            <MainView/>
            {
                ContextWindow ?
                    <div style={style} data-element='close-wrapper' onClick={closeHandler}>
                        {ContextWindow}
                    </div> :
                    null
            }
        </WinContext.Provider>
    )

};