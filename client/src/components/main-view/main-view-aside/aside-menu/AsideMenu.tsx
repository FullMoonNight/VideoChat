import './AsideMenu.css'
import {useContext, useEffect, useRef} from "react";
import {ViewPanelsContext} from "../../MainView";
import {FriendTemplate} from "../../aside-list/aside-list-templates/FriendTemplate";
import {AsideList} from "../../aside-list/AsideList";
import {MainContext} from "../../../../index";
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {observer} from "mobx-react-lite";


export const AsideMenu = observer(() => {
    const {changeHandler} = useContext(ViewPanelsContext)
    const {friends} = useContext(MainContext)

    useEffect(() => {
        const savedActiveType = localStorage.getItem('activeMenuItem')
        if (savedActiveType) {
            setActiveElement(savedActiveType, null)
        }
    }, [])

    const menuBlock = useRef<HTMLDivElement>(null)
    const currentActiveElement = useRef<{ currentActive: HTMLDListElement | null }>({currentActive: null})

    const formatData = (dataList: any[], idValue: string) => {
        if (idValue === 'id') return dataList
        return dataList.map(e => ({...e, id: e[idValue]}))
    }

    const setActiveElement = async (type: string, element: HTMLDListElement | null) => {
        if (!element && menuBlock.current) {
            element = menuBlock.current.querySelector(`[data-name=${type}]`)
        }

        if (currentActiveElement.current.currentActive) {
            currentActiveElement.current.currentActive.classList.remove('active')
        }
        element && element.classList.add('active')
        currentActiveElement.current.currentActive = element
        localStorage.setItem('activeMenuItem', type)

        let asideTemplate,
            mainComponent,
            mapKey = 'id',
            data: any[] = []

        switch (type) {
            case 'friends':
                await UserFriendsController.getAllFriends()
                asideTemplate = FriendTemplate
                mapKey = 'linkId'
                data = friends.friends.friends
        }
        changeHandler({
            asideComponent: <AsideList dataArray={formatData(data, mapKey)} Template={asideTemplate}/>
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