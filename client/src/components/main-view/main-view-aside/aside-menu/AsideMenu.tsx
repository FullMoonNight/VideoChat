import './AsideMenu.css'
import {useContext, useEffect, useRef} from "react";
import {ViewPanelsContext} from "../../MainView";
import {FriendTemplate} from "../../aside-list/aside-list-templates/FriendTemplate";
import {AsideList} from "../../aside-list/AsideList";
import {MainContext} from "../../../../index";
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {observer} from "mobx-react-lite";
import {FriendMainPanel} from "../../main-panels/FriendMainPanel";


export const AsideMenu = observer(() => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const {friends} = useContext(MainContext)

    // Load all data first time
    useEffect(() => {
        Promise.all([UserFriendsController.getAllFriends()])
            .then(() => {
                const savedActiveType = localStorage.getItem('activeMenuItem')
                if (savedActiveType) {
                    setActiveElement(savedActiveType, null)
                }
            })
    }, [])

    const menuBlock = useRef<HTMLDivElement>(null)
    const currentActiveElement = useRef<{ currentActive: HTMLDListElement | null }>({currentActive: null})

    const formatData = (dataList: any[], idValue: string) => {
        if (idValue === 'id') return dataList
        return dataList.map(e => ({...e, id: e[idValue]}))
    }

    const setActiveElement = (type: string, element: HTMLDListElement | null) => {
        if (!element && menuBlock.current) {
            element = menuBlock.current.querySelector(`[data-name=${type}]`)
        }
        if (currentActiveElement.current.currentActive) {
            currentActiveElement.current.currentActive.classList.remove('active')
        }
        element && element.classList.add('active')
        currentActiveElement.current.currentActive = element
        localStorage.setItem('activeMenuItem', type)

        let asideListTemplate,
            mainComponent,
            mapKey = 'id',
            data: any[] = [];

        switch (type) {
            case 'directChats':
                break
            case 'groupChats':
                break
            case 'friends':
                asideListTemplate = FriendTemplate
                mainComponent = <FriendMainPanel/>
                mapKey = 'linkId'
                data = friends.friends.friends
                break
            case 'videoConf':
                break
        }
        setPanelsHandler({
            asideComponent: <AsideList dataArray={formatData(data, mapKey)} Template={asideListTemplate}/>,
            mainComponent: mainComponent
        })
    }

    const clickHandler = (e: any) => {
        const element = e.target
        const elementType = element.dataset.name
        if (!elementType) return

        setActiveElement(elementType, element)
    }

    return (
        <div className='menu-block' ref={menuBlock}>
            <ul className="menu-item-list" onClick={clickHandler}>
                <li className="menu-item" data-name='directChats'>D</li>
                <li className="menu-item" data-name='groupChats'>G</li>
                <li className="menu-item" data-name='friends'>F</li>
                <li className="menu-item" data-name='videoConf'>V</li>
            </ul>
        </div>
    )
})