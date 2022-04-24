import {useContext} from "react";
import {WinContext} from "../../../../../pages/MainViewPage";
import {CreateRoomPanel} from "../../../ui-panels/create-room-panel/CreateRoomPanel";
import './CreateToomBtn.css'

export const CreateRoomBtn = () => {
    const {setContextWindow} = useContext(WinContext)

    const clickHandler = (e: any) => {
        setContextWindow(<CreateRoomPanel/>)
    }

    return (
        <div className='btn-wrapper'>
            <button onClick={clickHandler}>
                <span>+</span>
                <span>Создать комнату</span>
            </button>
        </div>
    )
}