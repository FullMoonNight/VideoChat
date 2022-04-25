import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import './CreateRoomPanel.css'
import {useImmer} from "use-immer";
import RoomController from "../../../../controllers/RoomController";
import {WinContext} from "../../../../pages/MainViewPage";

export const CreateRoomPanel = observer(() => {
    const {friends, user} = useContext(MainContext)
    const {closeHandler} = useContext(WinContext)

    const [friendList, setFriendList] = useState(friends.friends)
    const [includedFriendList, setIncludedFriendList] = useState<typeof friends.friends>([])
    const [roomName, setRoomName] = useState('')
    const [checkboxValues, setCheckboxValues] = useImmer<{ text: boolean, handWr: boolean, chat: boolean }>({text: false, handWr: false, chat: true})

    useEffect(() => {
        setFriendList(friends.friends)
    }, [friends.friends])

    const removeIncludedFriend = (userId: string) => {
        const user = includedFriendList.find(friend => friend.user.userId === userId)
        if (user) {
            setIncludedFriendList(arr => arr.filter(friend => friend.user.userId !== userId))
            setFriendList(arr => [...arr, user])
        }
    }

    const includeFriend = (userId: string) => {
        const user = friendList.find(friend => friend.user.userId === userId)
        if (user) {
            setFriendList(arr => arr.filter(friend => friend.user.userId !== userId))
            setIncludedFriendList(arr => [...arr, user])
        }
    }

    const checkboxHandler = (e: any) => {
        const field: 'handWr' | 'text' | 'chat' = e.target.name;
        setCheckboxValues(draft => {
            draft[field] = !draft[field]
        })
    }

    const roomNameInputHandler = (e: any) => {
        const roomName = e.target.value
        setRoomName(roomName)
    }

    const createNewRoomHandler = async (e: any) => {
        e.preventDefault()
        if (user.user.userId) {
            const includedUsersId = includedFriendList.map(friend => friend.user.userId)
            await RoomController.createNewRoom({
                userId: user.user.userId,
                room: {
                    roomName,
                    includedUsersId,
                    handWrEditor: checkboxValues.handWr,
                    textEditor: checkboxValues.text,
                    chat: checkboxValues.chat
                }
            })
            closeHandler()
        }
    }

    return (
        <div className="create-room-panel">
            <div className="panel-header">
                <span>Create new group room</span>
                <button disabled={!roomName} onClick={createNewRoomHandler}>Create</button>
            </div>
            <div className="separator-line"></div>
            <div className="input-block">
                <form onSubmit={createNewRoomHandler}>
                    <input id='room-name-input' value={roomName} onChange={roomNameInputHandler} required autoFocus/>
                    <label htmlFor="room-name-input">Room name</label>
                </form>
            </div>
            <div className="checkbox-group">
                <label className="checkbox-field">
                    Add chat
                    <input type="checkbox" name='chat' hidden checked={checkboxValues.chat} onChange={checkboxHandler}/>
                    <span className="checkmark"></span>
                </label>
                <label className="checkbox-field">
                    Add text editor
                    <input type="checkbox" name='text' hidden checked={checkboxValues.text} onChange={checkboxHandler}/>
                    <span className="checkmark"></span>
                </label>
                <label className="checkbox-field">
                    Add handwritten editor
                    <input type="checkbox" name='handWr' hidden checked={checkboxValues.handWr} onChange={checkboxHandler}/>
                    <span className="checkmark"></span>
                </label>

            </div>
            <div className="users-grid">
                <div className="included-users">
                    <p>Included users</p>
                    <div className="included-users__container">
                        {
                            includedFriendList.length ?
                                includedFriendList.map(friend => (
                                    <div key={friend.linkId} className='user-card'>
                                        <img src={`user-avatar/${friend.user.userId}--${friend.user.userImageId}.png`} alt=""
                                             className="user-card__user-img"/>
                                        <p className='user-card__username'>{friend.user.username}</p>
                                        <div className="user-card__spacer"></div>
                                        <button className='user-card__action-btn' onClick={() => removeIncludedFriend(friend.user.userId)}>X</button>
                                    </div>
                                )) :
                                'Don\'t include any users'
                        }
                    </div>
                </div>
                <div className="available-friends">
                    <input id='af__checkbox' className='spread-checkbox' type="checkbox" hidden/>
                    <label className="available-friends__collapsed-block-label" htmlFor='af__checkbox'>
                        Add friends to room
                        <div className="line"></div>
                        <span className='arrow'>v</span>
                    </label>
                    <div className="available-friends__container">
                        {
                            friendList.map(friend => (
                                <div key={friend.linkId} className='user-card'>
                                    <img src={`user-avatar/${friend.user.userId}--${friend.user.userImageId}.png`} alt=""
                                         className="user-card__user-img"/>
                                    <p className='user-card__username'>{friend.user.username}</p>
                                    <div className="user-card__spacer"></div>
                                    <button className='user-card__action-btn' onClick={() => includeFriend(friend.user.userId)}>+</button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
});