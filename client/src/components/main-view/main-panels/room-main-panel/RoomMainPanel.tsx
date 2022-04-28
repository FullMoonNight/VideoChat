import React, {useContext, useEffect, useMemo} from 'react';
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {FriendTemplate} from "../../list-templates/FriendTemplate";
import './RoomMainPanel.css'
import {WinContext} from "../../../../pages/MainViewPage";
import {RoomPanel} from "../../ui-panels/ room-panel/RoomPanel";
import RoomController from "../../../../controllers/RoomController";
import {ViewPanelsContext} from "../../MainView";
import {FaCrown} from "react-icons/fa";

interface Props {
    roomId: string
}

export const RoomMainPanel = observer(({roomId}: Props) => {
    //todo по хорошему сделть загрузку участников комнаты при загрузке панели.
    // Хотя не ясно где в дальнейшем может понадобится эта инфромация и может
    // ли она быть нужна до откртия той или иной комнаты

    const {rooms, user} = useContext(MainContext)
    const {setContextWindow} = useContext(WinContext)
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const currentRoom = useMemo(() => rooms.rooms.find(room => room.roomId === roomId), [roomId, rooms.rooms])


    useEffect(() => {
        if (currentRoom && !currentRoom.confirm) {
            RoomController.confirmJoinRoom({roomId})
        }
    }, [currentRoom])

    const connectHandler = () => {
        currentRoom && setContextWindow(<RoomPanel room={currentRoom}/>)
    }

    const leaveHandler = () => {
        RoomController.leaveRoom({roomId: roomId})
            .then(res => setPanelsHandler({mainComponent: null}))
    }

    return (
        <div className='room-main-panel'>
            <header>
                <span className='room-name'>{currentRoom?.name}</span>
                <span className='crown-emblem' hidden={currentRoom?.owner !== user.user.userId}><FaCrown/></span>
            </header>
            <main className='room-main-panel__room-info'>
                <div className="room-info__content">
                    <img src={`/room-image/${currentRoom?.roomId}--${currentRoom?.roomImageId}.png`} alt="" className="room-image"/>
                    <div className='room-info__menu'>
                        <span>{currentRoom?.name}</span>
                        <button hidden={currentRoom?.owner !== user.user.userId}>Room settings</button>
                    </div>
                    <div className="spacer"></div>
                    <div className="control-panel">
                        <button className='control-panel__connect' onClick={connectHandler}>Connect to room</button>
                        <button className='control-panel__invite'>Invite friends</button>
                        <button className='control-panel__leave' onClick={leaveHandler}>Leave room</button>
                    </div>
                </div>
            </main>
            <div className="main-content">
                <div className="members-list">
                    <h2>List of members</h2>
                    <div className="members-list__container">
                        <div className="members-list__content">
                            {
                                currentRoom?.roomMembers.map(user => {
                                    return (<FriendTemplate key={user.userId} data={{id: user.userId, user}} props={{buttonConfig: {}}}/>)
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="chat-window">
                    {/*todo сделать отдельный компонент чата */}
                </div>
            </div>

        </div>
    );
})