import React, {useContext, useMemo} from 'react';
import './RoomPanel.css'
import {useWebRTC} from "../../../../hooks/useWebRTC";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {UserElementType} from "../../../../types/UserElementType";
import {WinContext} from "../../../../pages/MainViewPage";
import {BsCameraVideoFill, BsCameraVideoOffFill, BsFileTextFill, BsFillMicFill, BsFillMicMuteFill} from "react-icons/bs";
import {MdHeadset, MdHeadsetOff} from "react-icons/md";
import {IoExit} from "react-icons/io5";
import {FaPaintBrush} from "react-icons/fa";
import {HiSwitchHorizontal} from "react-icons/hi";
import {RoomElementType} from "../../../../types/RoomElementType";
import {PaintEditor} from "../../../editors/paint-editor/PaintEditor";
import {TextEditor} from "../../../editors/text-editor/TextEditor";
import {RiChat4Fill, RiChatOffFill} from "react-icons/ri";
import {Chat} from "../../../chat-component/Chat";

interface Params {
    room: RoomElementType
}

export const RoomPanel = observer(({room}: Params) => {
    const {rooms, user, profile, chats} = useContext(MainContext)
    const {closeHandler} = useContext(WinContext)
    const roomMembers = useMemo(() => {
        const membersMap: { [key: string]: UserElementType } = {}
        room?.roomMembers.forEach(member => {
            membersMap[member.userId] = member
        })
        return membersMap
    }, [room])
    const roomChat = useMemo(() => chats.chats.find(chat => chat.chatId === room.chat), [])

    const {clients, provideMediaRef, controllers} = useWebRTC(room)
    return (
        <div className="no-close-wrapper">
            <div className='room-panel'>
                <div className="room-panel__content">
                    {clients.map(clientObj => {
                        let member: { userId: string, userImageId: string, username: string }
                        if (clientObj.socketId === 'local') {
                            member = {userId: user.user.userId || '', userImageId: profile.settings.userImageId, username: profile.settings.username}
                        } else {
                            member = roomMembers[clientObj.userId]
                        }
                        return (
                            <div key={clientObj.socketId} className='member-plate'>
                                <img src={`/user-avatar/${member.userId}--${member.userImageId}.png`} alt=""/>
                                <div className="video-block">
                                    <video
                                        ref={instance => {
                                            provideMediaRef(clientObj.socketId, instance)
                                        }}
                                        src=""
                                        autoPlay
                                        playsInline
                                        controls={false}
                                        muted={clientObj.socketId === 'local'}
                                    />
                                </div>
                                <p className="username">{member.username}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="room-panel__editors-block" hidden={!controllers.editor.visible}>
                    <div className="editor-header" hidden={!(room?.editors.handWr && room?.editors.text)}>
                        <button title='switch editor' onClick={() => controllers.editor.visualHandler('switch')}><HiSwitchHorizontal/></button>
                    </div>
                    {
                        controllers.editor.editorType === 'text' ?
                            <TextEditor value={controllers.editor.textEditorState} onChange={(value) => controllers.editor.onChangeTextHandler(value, 'text')}/> :
                            <PaintEditor getDrawMethod={controllers.editor.getCanvasDrawMethod}
                                         onChange={(value) => controllers.editor.onChangeCanvasHandler(value, 'handWr')}/>
                    }
                </div>
                <div className="room-panel__control-block">
                    <div className="button-block">
                        <button className='microphone' onClick={controllers.microphone.handler}>
                            {
                                controllers.microphone.mute ?
                                    <BsFillMicMuteFill/> :
                                    <BsFillMicFill/>
                            }
                        </button>
                        <button className='mute' onClick={controllers.deafen.handler}>{controllers.deafen.state ? <MdHeadsetOff/> : <MdHeadset/>}</button>
                        <button className='video' onClick={controllers.video.handler}>{controllers.video.visible ? <BsCameraVideoFill/> : <BsCameraVideoOffFill/>}</button>
                        <button className='leave' onClick={() => closeHandler()}><IoExit/></button>
                        <div className="spacer"></div>
                        {
                            room && (room.editors.text || room.editors.handWr) ?
                                <button className='editors' onClick={() => controllers.editor.visualHandler('changeVisible')}>
                                    {
                                        controllers.editor.editorType === 'text' ?
                                            <BsFileTextFill/> :
                                            <FaPaintBrush/>
                                    }
                                </button> :
                                null
                        }
                        {
                            room && room.chat ?
                                <button className='chat' onClick={controllers.chat.handler}>{controllers.chat.visible ? <RiChat4Fill/> : <RiChatOffFill/>}</button> :
                                null
                        }
                    </div>
                </div>
                {
                    controllers.chat.visible && roomChat && (
                        <div className="room-panel__chat-block">
                            <Chat chat={roomChat}/>
                        </div>
                    )
                }
            </div>
        </div>
    );
});