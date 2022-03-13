import React, {CSSProperties} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {MainView} from "../components/main-view/MainView";


export const MainViewPage = () => {
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

    const navigate = useNavigate()
    const location = useLocation()
    const main = location.pathname === '/main'

    const goToMain = (e: any) => {
        if (e.target.dataset.element !== 'close-wrapper') return
        navigate('main')
    }


    return (
        <>
            <MainView/>
            {main ?
                null :
                <div style={style} data-element='close-wrapper' onClick={goToMain}>
                    <Outlet/>
                </div>}
        </>
    )

};