import React, {useContext, useMemo} from 'react';
import {Chat} from "../../../chat-component/Chat";
import {ChatElementType} from "../../../../types/ChatElementType";
import './DiectMessageMainPanel.css'
import {MainContext} from "../../../../index";

interface Props {
    chat: ChatElementType
}

export const DirectMessagesMainPanel = ({chat}: Props) => {
    const {user} = useContext(MainContext)
    const interlocutor = useMemo(() => chat.chatMembers.find(member => member.userId !== user.user.userId), [chat.chatMembers])

    return (
        <div className='direct-messages-panel'>
            <header className='direct-messages-panel__header'>
                <div className="interlocutor-block">
                    <img src={`user-avatar/${interlocutor?.userId}--${interlocutor?.userImageId}.png`} alt=""/>
                    <span className="username">{interlocutor?.username}</span>
                </div>
            </header>
            <div className="direct-messages-panel__main-block">
                <Chat chatId={chat.chatId}/>
            </div>
        </div>
    );
};