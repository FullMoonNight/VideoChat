import React, {useContext, useRef, useState} from 'react';
import './Chat.css'
import {ChatElementType} from "../../types/ChatElementType";
import {MainContext} from "../../index";
import {BsFileEarmark} from "react-icons/bs";
import {IoSend} from "react-icons/io5";
import {ImAttachment} from "react-icons/im";

interface Props {
    chat: ChatElementType
}

export const Chat = ({chat}: Props) => {
    const {profile, user} = useContext(MainContext)
    const [messageValue, setMessageValue] = useState('')

    const changeHandler = (e: any) => {
        setMessageValue(e.target.innerText.trim())
    }

    const splitDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return {
            year: date.getFullYear(),
            month: ('0' + (1 + date.getMonth())).slice(-2),
            date: date.getDate(),
            hour: date.getHours(),
            minute: ('0' + (1 + date.getMinutes())).slice(-2)
        }
    }

    const formatSize = (byteSize: number) => {
        let result = `${byteSize} B`
        const size = ['Kb', 'Mb', 'Gb']
        let i = 0
        while (byteSize > 100) {
            result = `${Math.trunc(byteSize * 10 / 1024) / 10} ${size[i++]}`
            byteSize /= 1024
        }
        return result
    }

    return (
        <div className='chat-container'>
            <div className="message-list">
                <div className="message-list__container">
                    {
                        chat.messages.map(message => {
                            let sender = chat.chatMembers.find(member => member.userId === message.senderUserId)
                            if (!sender && user.user.userId) {
                                sender = {
                                    userId: user.user.userId,
                                    username: profile.settings.username,
                                    userImageId: profile.settings.userImageId,
                                    status: profile.settings.status || 'active'
                                }
                            }
                            const {year, month, date, hour, minute} = splitDate(message.sendDate)
                            const whoseMessage = message.senderUserId === user.user.userId ? 'my-message' : 'other-user-message'
                            return (
                                <div key={message.messageId} className={`message ${whoseMessage}`}>
                                    <div className="sender">
                                        <img src={`user-avatar/${sender?.userId}--${sender?.userImageId}.png`} alt=""/>
                                    </div>
                                    <div className='message-block'>
                                        <div className="message-content">
                                            {
                                                message.type === 'text' ?
                                                    <div className='message-text'>
                                                        {message.value}
                                                    </div> :
                                                    <div className='message-file'>
                                                        <div className="message-file__img">
                                                            <BsFileEarmark/>
                                                        </div>
                                                        <div className="message-file__file-info">
                                                            <span className="file-name">{message.fileName}</span>
                                                            <span className="file-size">{formatSize(message.size)}</span>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="date-info">
                                        <span className="date">{`${date}/${month}/${year}`}</span>
                                        <span className="time">{`${hour}:${minute}`}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="chat-input">
                <label>
                    <ImAttachment/>
                    <input type="file" multiple hidden/>
                </label>
                <div className={`textarea${messageValue.length ? '' : ' empty'}`} contentEditable onKeyUp={changeHandler} aria-required></div>
                <button><IoSend/></button>
            </div>
        </div>
    );
};