import React, {useContext, useMemo} from 'react';
import './RoomPanel.css'
import {useWebRTC} from "../../../../hooks/useWebRTC";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {UserElementType} from "../../../../types/UserElementType";
import {WinContext} from "../../../../pages/MainViewPage";
import {BsCameraVideoFill, BsCameraVideoOffFill, BsFileTextFill, BsFillMicFill, BsFillMicMuteFill} from "react-icons/bs";
import {MdHeadset, MdHeadsetOff} from "react-icons/md";
import {IoChatbox, IoExit} from "react-icons/io5";
import {FaPaintBrush} from "react-icons/fa";
import {HiSwitchHorizontal} from "react-icons/hi";
import {Editor} from "../../../editors/Editor";
import {RoomElementType} from "../../../../types/RoomElementType";
import {PaintEditor} from "../../../editors/paint-editor/PaintEditor";
import {values} from "mobx";

interface Params {
    room: RoomElementType
}

export const RoomPanel = observer(({room}: Params) => {
    const {rooms, user, profile} = useContext(MainContext)
    const {closeHandler} = useContext(WinContext)
    const roomMembers = useMemo(() => {
        const membersMap: { [key: string]: UserElementType } = {}
        room?.roomMembers.forEach(member => {
            membersMap[member.userId] = member
        })
        return membersMap
    }, [room])

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
                    {controllers.editor.editorType === 'text' ?
                        <Editor type='text' value={controllers.editor.textEditorState} onChange={(value) => controllers.editor.onChangeHandler(value, 'text')}
                                size={{height: '100%', width: '100%'}}/> :
                        <Editor type='handWr' value={''} onChange={(value) => () => {
                        }}/>
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
                                <button className='chat'><IoChatbox/></button> :
                                null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
});