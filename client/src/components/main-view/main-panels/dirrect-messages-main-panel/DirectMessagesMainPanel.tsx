import React, {useMemo} from 'react';
import {Chat} from "../../../chat-component/Chat";
import {ChatElementType} from "../../../../types/ChatElementType";
import './DiectMessageMainPanel.css'

interface Props {
    chat: ChatElementType
}

export const DirectMessagesMainPanel = ({chat}: Props) => {
    const interlocutor = useMemo(() => chat.chatMembers[0], [chat.chatMembers])

    return (
        <div className='direct-messages-panel'>
            <header className='direct-messages-panel__header'>
                <div className="interlocutor-block">
                    <img src={`user-avatar/${interlocutor.userId}--${interlocutor.userImageId}.png`} alt=""/>
                    <span className="username">{interlocutor.username}</span>
                </div>
            </header>
            <div className="direct-messages-panel__main-block">
                <Chat chat={chat}/>
            </div>
        </div>
    );
};