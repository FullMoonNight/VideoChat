import {ChangeEvent, useContext, useEffect, useMemo, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../index";
import {FriendTemplate} from "../aside-list/aside-list-templates/FriendTemplate";
import './FriendMainPanel.css'
import UserFriendsController from "../../../controllers/UserFriendsController";
import {toJS} from "mobx";

interface FriendElement {
    linkId: string,
    user: {
        userId: string,
        username: string,
        userImageId: string,
        status?: 'active' | 'sleep' | 'invisible'
    },
    status: 'friends' | 'pending' | 'request'
}

interface ButtonsState {
    message?: boolean,
    addFriend?: boolean,
    acceptFriend?: boolean,
    rejectFriend?: boolean,
    removeFriend?: boolean
}


export const FriendMainPanel = observer(() => {
        const {friends} = useContext(MainContext)

        useEffect(() => {
            console.log('effect', toJS(friends))
        }, [friends.friends, friends.request, friends.pending])

        const friendsUnitedList = useMemo(friends.getAllFriends.bind(friends), [friends.friends, friends.request, friends.pending])
        console.log(toJS(friendsUnitedList))

        const [searchUsernameString, setSearchUsernameString] = useState<string>('')
        const [sectionName, setSectionName] = useState<string>('')
        const [searchButtonVisible, setSearchButtonVisible] = useState<boolean>(false)
        const [friendsList, setFriendsList] = useState<FriendElement[]>([])
        const [buttons, setButtons] = useState<ButtonsState>({})

        const currentActiveElement = useRef<HTMLDListElement | null>(null)
        const menuBlock = useRef<HTMLUListElement | null>(null)

        useEffect(() => {
            setActiveElement('active', null)
        }, [])

        const setActiveElement = (menuTab: string, element: HTMLDListElement | null) => {
            if (element && element.classList.contains('active')) {
                return
            }
            if (!element && menuBlock.current) {
                element = menuBlock.current.querySelector(`[data-tab=${menuTab}]`)
            }
            if (currentActiveElement.current) {
                currentActiveElement.current.classList.remove('active')
            }
            element && element.classList.add('active')
            currentActiveElement.current = element

            setSearchButtonVisible(false)
            setSearchUsernameString('')

            let arr: FriendElement[] = []
            switch (menuTab) {
                case 'active':
                    arr = friendsUnitedList.filter(e => e.status === 'friends' && e.user.status === 'active')
                    setSectionName('Online friends')
                    setButtons({message: true, removeFriend: true})
                    break
                case 'all':
                    arr = friendsUnitedList.filter(e => e.status === 'friends')
                    setSectionName('All friends')
                    setButtons({message: true, removeFriend: true})
                    break
                case 'requested':
                    arr = friendsUnitedList.filter(e => e.status === 'request')
                    setSectionName('Incoming friends requests')
                    setButtons({acceptFriend: true, rejectFriend: true})
                    break
                case 'pending':
                    arr = friendsUnitedList.filter(e => e.status === 'pending')
                    setSectionName('Waiting friends requests')
                    setButtons({removeFriend: true})
                    break
                case 'add':
                    arr = []
                    setSectionName('Add new friends')
                    setSearchButtonVisible(true)
                    setButtons({addFriend: true})
                    break
            }
            setFriendsList(arr)
        }

        const headerMenuClick = (e: any) => {
            const element = e.target
            const menuTab = element.dataset.tab
            if (!menuTab) return

            setActiveElement(menuTab, element)
        }

        const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchUsernameString(e.target.value)
        }

        const findUsersHandler = async () => {
            const users = await UserFriendsController.findFriendsByUsername({usernamePart: searchUsernameString})
            setFriendsList(users)
        }

        return (
            <div className="friend-list-panel">
                <div className="friend-type-header">
                    <p>Friends</p>
                    <ul onClick={headerMenuClick} ref={menuBlock}>
                        <li data-tab='active'>Online</li>
                        <li data-tab='all'>All</li>
                        <li data-tab='requested'>Requested</li>
                        <li data-tab='pending'>Pending</li>
                        <li className="add-friends" data-tab='add'>Add friends</li>
                    </ul>
                </div>
                <div className="search-line">
                    <input type="text" placeholder='Username' value={searchUsernameString} onChange={inputChangeHandler}/>
                    <button hidden={!searchButtonVisible} onClick={findUsersHandler}>Find</button>
                </div>
                <div className="section-name">
                    {sectionName}
                </div>
                <div className="friend-list-container">
                    <div className="friend-list-block">
                        <div className="friend-list-content">
                            {
                                friendsList.map(data => (
                                    <FriendTemplate key={data.linkId} data={{...data, id: data.linkId}} buttonConfig={buttons}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)