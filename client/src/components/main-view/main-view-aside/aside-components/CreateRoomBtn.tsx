import RoomController from "../../../../controllers/RoomController";
import {useContext} from "react";
import {MainContext} from "../../../../index";

export const CreateRoomBtn = () => {
    const {user} = useContext(MainContext)

    const clickHandler = (e: any) => {
        const userId = user.user.userId
        userId && RoomController.createNewRoom({userId})
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