import './ConferenceRoomTemplate.css'
import {RoomElementType} from "../../../../types/RoomElementType";
import {useContext} from "react";
import {RoomMainPanel} from "../../main-panels/room-main-panel/RoomMainPanel";
import {ViewPanelsContext} from "../../MainView";

interface Props {
    data: {
        id: string
    } & RoomElementType
    props: {}
}

export const ConferenceRoomTemplate = ({data}: Props) => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)

    const clickHandler = () => {
        setPanelsHandler({
            mainComponent: <RoomMainPanel roomId={data.roomId}/>
        })
    }

    return (
        <div className='room-element' onClick={clickHandler}>
            <div className="room-element__image">
                <img src={`room-image/${data.roomId}--${data.roomImageId}.png`} alt="room-img"/>
                <span hidden={data.confirm}>NEW</span>
            </div>
            <span className='room-element__room-name'>{data.name}</span>
        </div>
    )
}