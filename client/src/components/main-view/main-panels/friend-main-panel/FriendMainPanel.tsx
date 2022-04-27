import {ChangeEvent, useContext, useEffect, useMemo, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {MainContext} from "../../../../index";
import {FriendTemplate} from "../../list-templates/FriendTemplate";
import './FriendMainPanel.css'
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {FriendElementType} from "../../../../types/FriendElementType";

interface ButtonsState {
    message?: boolean,
    addFriend?: boolean,
    acceptFriend?: boolean,
    rejectFriend?: boolean,
    removeFriend?: boolean
}

export const FriendMainPanel = observer(() => {
        const {friends} = useContext(MainContext)
        const friendsUnitedList = useMemo(friends.getAllFriends.bind(friends), [friends.friends, friends.request, friends.pending])

        const [searchUsernameString, setSearchUsernameString] = useState<string>('')
        const [sectionName, setSectionName] = useState<string>('')
        const [searchButtonVisible, setSearchButtonVisible] = useState<boolean>(false)
        const [friendsList, setFriendsList] = useState<FriendElementType[]>([])
        const [buttons, setButtons] = useState<ButtonsState>({})
        const [requestUsersCount, setRequestUsersCount] = useState<number>(0)

        const currentActiveElement = useRef<HTMLDListElement | null>(null)
        const menuBlock = useRef<HTMLUListElement | null>(null)
        const currentActiveTabType = useRef<string>('online')

        //Обновляет все списки после изменеия данных
        useEffect(() => {
            setFriendListsState()
        }, [friendsUnitedList])

        useEffect(() => {
            setActiveElement(currentActiveTabType.current, null)
        }, [])

        useEffect(() => {
            setRequestUsersCount(friends.request.length)
        }, [friends.request])

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
            currentActiveTabType.current = menuTab

            setFriendListsState()
        }

        const setFriendListsState = () => {
            const menuTab = currentActiveTabType.current

            let arr: FriendElementType[] = []
            switch (menuTab) {
                case 'online':
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
                    setSectionName('Add new friends')
                    setSearchButtonVisible(true)
                    setButtons({addFriend: true})
                    setFriendsList([])
                    break
            }
            if (menuTab === 'add') {
                findUsersHandler()
            } else {
                setFriendsList(arr)
            }
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

        const findUsersHandler = async (e?: any) => {
            e?.preventDefault()
            if (!searchButtonVisible) return
            const users = await UserFriendsController.findFriendsByUsername({usernamePart: searchUsernameString})
            setFriendsList(users)
        }

        const filterUsersHandler = (elem: FriendElementType) => {
            if (currentActiveTabType.current === 'add') return true
            return elem.user.username.includes(searchUsernameString)
        }

        return (
            <div className="friend-list-panel">
                <header className="friend-type-header">
                    <p>Friends</p>
                    <ul onClick={headerMenuClick} ref={menuBlock}>
                        <li data-tab='online'>Online</li>
                        <li data-tab='all'>All</li>
                        <li data-tab='requested'>Requested<p hidden={!requestUsersCount}>{requestUsersCount}</p></li>
                        <li data-tab='pending'>Pending</li>
                        <li className="add-friends" data-tab='add'>Add friends</li>
                    </ul>
                </header>
                <div className="search-line">
                    <form onSubmit={findUsersHandler}><input type="text" placeholder='Search' value={searchUsernameString} onChange={inputChangeHandler}/></form>
                    <button hidden={!searchButtonVisible} onClick={findUsersHandler}>Find</button>
                </div>
                <div className="section-name">
                    {sectionName}
                </div>
                <div className="friend-list-container">
                    <div className="friend-list-block">
                        <div className="friend-list-content">
                            {
                                friendsList
                                    .filter(filterUsersHandler)
                                    .map(data => (
                                        <FriendTemplate key={data.linkId} data={{...data, id: data.linkId}} props={{buttonConfig: buttons}}/>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)