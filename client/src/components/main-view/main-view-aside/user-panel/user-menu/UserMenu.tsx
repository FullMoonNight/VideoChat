import React, {useEffect} from 'react';
import './UserMenu.css'
import {useNavigate} from "react-router-dom";

interface Props {
    setActive: (active: boolean) => void,
}

export const UserMenu = ({setActive}: Props) => {
    useEffect(() => {
        const handler = () => {
            setActive(false)
        }
        document.getElementById('root')?.addEventListener('click', handler)
        return () => document.getElementById('root')?.removeEventListener('click', handler)

    }, [])

    const navigation = useNavigate()

    const settingsHandler = () => {
        navigation('/main/settings')
    }

    return (
        <div className='user-menu'>
            <div>
                <span>Change status</span>
            </div>
            <div onClick={settingsHandler}>
                <span>Settings</span>
            </div>
            <div>
                <span>Logout</span>
            </div>
        </div>
    );
};