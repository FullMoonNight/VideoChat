import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import './Chat.css'
import {ChatElementType} from "../../types/ChatElementType";
import {MainContext} from "../../index";
import {BsFileEarmark} from "react-icons/bs";
import {IoCloseSharp, IoSend} from "react-icons/io5";
import {ImAttachment} from "react-icons/im";
import ChatsController from "../../controllers/ChatsController";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";

interface Props {
    chatId: string
}

export const Chat = observer(({chatId}: Props) => {
    const {user, chats} = useContext(MainContext)
    const [messageValue, setMessageValue] = useState('')
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const currentChat = useMemo(() => chats.chats.find(chat => chat.chatId === chatId), [chats.chats, chatId])

    const messageList = useRef<HTMLDivElement>(null)
    const inputBlock = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messageList.current) {
            messageList.current.scroll(0, messageList.current.scrollHeight)
        }
    }, [])

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

    const fileInputChange = (e: any) => {
        setAttachedFiles(prevState => [...prevState, ...e.target.files])
    }

    const removeFile = (index: number) => {
        setAttachedFiles(prevState => prevState.filter((file, i) => index !== i))
    }

    const sendMessage = () => {
        if (user.user.userId && (messageValue.trim().length || attachedFiles.length) && currentChat) {
            ChatsController.sendMessage(
                {
                    message: messageValue,
                    chatId: currentChat.chatId,
                    chatType: currentChat.type,
                    dispatchDate: new Date().toJSON(),
                    userId: user.user.userId
                },
                attachedFiles
            )
            setMessageValue('')
            inputBlock.current && (inputBlock.current.innerText = '')
            setAttachedFiles([])
        }
    }

    const downloadFileHandler = (chatId: string, messageId: string) => {
        if (!currentChat) return
        ChatsController.downloadFile({chatId, messageId, chatType: currentChat.type})
    }

    return (
        <div className='chat-container'>
            <div className="message-list">
                <div ref={messageList} className="message-list__container">
                    {
                        currentChat?.messages.map(message => {
                            let sender = currentChat.chatMembers.find(member => member.userId === message.senderUserId)
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
                                                    <div className='message-file' onClick={() => downloadFileHandler(currentChat.chatId, message.messageId)}>
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
                <div className="attached-files-block" hidden={!attachedFiles.length}>
                    {
                        attachedFiles.map((file, i) => (
                            <div key={i} className='attached-file'>
                                <button className="remove" onClick={() => removeFile(i)}><IoCloseSharp/></button>
                                <span className="file_icon"><BsFileEarmark/></span>
                                <span className="filename">{file.name}</span>
                                <span className="file-size">{formatSize(file.size)}</span>
                            </div>
                        ))
                    }
                </div>
                <div className="input-block">
                    <label>
                        <ImAttachment/>
                        <input type="file" multiple hidden onChange={fileInputChange}/>
                    </label>
                    <div ref={inputBlock} className={`textarea${messageValue.length ? '' : ' empty'}`} contentEditable onKeyUp={changeHandler}></div>
                    <button onClick={sendMessage}><IoSend/></button>
                </div>
            </div>
        </div>
    );
});