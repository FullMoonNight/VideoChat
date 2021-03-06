import './AsideMenu.css'
import {useContext, useEffect, useRef, useState} from "react";
import {ViewPanelsContext} from "../../MainView";
import {FriendTemplate} from "../../list-templates/friend-template/FriendTemplate";
import {AsideList} from "../aside-list/AsideList";
import {MainContext} from "../../../../index";
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {observer} from "mobx-react-lite";
import {FriendMainPanel} from "../../main-panels/friend-main-panel/FriendMainPanel";
import {CreateRoomBtn} from "../aside-components/create-room-btn/CreateRoomBtn";
import {ConferenceRoomTemplate} from "../../list-templates/conference-room-template/ConferenceRoomTemplate";
import RoomController from "../../../../controllers/RoomController";
import {FaUserFriends} from "react-icons/fa";
import {IoChatbubble, IoChatbubbles} from "react-icons/io5";
import {BsCameraVideoFill} from "react-icons/bs";
import {ChatTemplate} from "../../list-templates/chat-template/ChatTemplate";
import ChatsController from "../../../../controllers/ChatsController";

const formatData = (dataList: any[], idValue: string) => {
    if (idValue === 'id') return dataList
    const idValueArr = idValue.split('.')
    return dataList.map(e => ({
        ...e, id: idValueArr.reduce((v, cur) => v[cur], e)
    }))
}

interface ViewConfigurationType {
    asideComponent?: JSX.Element | null,
    mainComponent?: JSX.Element | null,
}

export const AsideMenu = observer(() => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const {friends, rooms, chats} = useContext(MainContext)


    // Загрузка данных для всех элементов меню
    useEffect(() => {
        Promise.all(
            [
                UserFriendsController.getAllFriends(),
                RoomController.getUserRooms(),
                ChatsController.getUserChats()
            ]
        ).then(() => {
            const savedActiveType = localStorage.getItem('activeMenuItem')
            if (savedActiveType) {
                setActiveElement(savedActiveType, null)
            }
        });
    }, [])

    const [viewConfiguration, setViewConfiguration] = useState<ViewConfigurationType>({})
    useEffect(() => {
        setPanelsHandler({
            asideComponent: viewConfiguration.asideComponent,
            mainComponent: viewConfiguration.mainComponent
        })
    }, [viewConfiguration])

    useEffect(() => {
        setMenuState();
    }, [friends.friends, rooms.rooms, chats.chats])

    const menuBlock = useRef<HTMLDivElement>(null)
    const currentActiveElement = useRef<HTMLDListElement | null>(null)

    const setActiveElement = (type: string, element: HTMLDListElement | null) => {
        if (!element && menuBlock.current) {
            element = menuBlock.current.querySelector(`[data-name=${type}]`)
        }
        if (currentActiveElement.current) {
            currentActiveElement.current.classList.remove('active')
        }
        element && element.classList.add('active')
        currentActiveElement.current = element
        localStorage.setItem('activeMenuItem', type)

        setMenuState()
    }

    const setMenuState = () => {
        const type = currentActiveElement.current?.dataset.name
        if (!type) return

        switch (type) {
            case 'friends':
                setViewConfiguration({
                    asideComponent: <AsideList
                        Template={FriendTemplate}
                        dataList={formatData(friends.friends, 'linkId')}
                        props={{buttonConfig: {message: true}}}
                    />,
                    mainComponent: <FriendMainPanel/>,
                })
                break;
            case 'directChats':
                setViewConfiguration({
                    asideComponent: <AsideList
                        Template={ChatTemplate}
                        dataList={formatData(chats.chats.filter(chat => chat.type === 'common'), 'chatId')}
                        props={{}}
                    />,
                })
                break;
            case 'groupChats':
                setViewConfiguration({
                    asideComponent: null,
                    mainComponent: null,
                })
                break;
            case 'videoConf':
                setViewConfiguration({
                    asideComponent: (
                        <>
                            <CreateRoomBtn/>
                            <AsideList
                                Template={ConferenceRoomTemplate}
                                dataList={formatData(rooms.rooms, 'roomId')}
                                props={{}}
                            />
                        </>
                    ),
                })
                break;
        }
    }

    const clickHandler = (e: any) => {
        const element = e.target.closest('.menu-item')
        const elementType = element?.dataset?.name
        if (!elementType) return

        setActiveElement(elementType, element)
    }

    return (
        <div className='menu-block' ref={menuBlock}>
            <ul className="menu-item-list" onClick={clickHandler}>
                <li className="menu-item" data-name='friends'><FaUserFriends/></li>
                <li className="menu-item" data-name='directChats'><IoChatbubble/></li>
                {/*<li className="menu-item" data-name='groupChats'><IoChatbubbles/></li>*/}
                <li className="menu-item" data-name='videoConf'><BsCameraVideoFill/></li>
            </ul>
        </div>
    )
})