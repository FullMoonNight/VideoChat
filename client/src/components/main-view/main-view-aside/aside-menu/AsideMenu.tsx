import './AsideMenu.css'
import {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {ViewPanelsContext} from "../../MainView";
import {FriendTemplate} from "../../aside-list/aside-list-templates/FriendTemplate";
import {AsideList} from "../../aside-list/AsideList";
import {MainContext} from "../../../../index";
import UserFriendsController from "../../../../controllers/UserFriendsController";
import {observer} from "mobx-react-lite";
import {FriendMainPanel} from "../../main-panels/FriendMainPanel";
import {toJS} from "mobx";

const formatData = (dataList: any[], idValue: string) => {
    if (idValue === 'id') return dataList
    return dataList.map(e => ({...e, id: e[idValue]}))
}

interface ViewConfigurationType {
    asideListTemplate?: FunctionComponent<any>,
    mapKey: string,
    mainComponent?: JSX.Element | null,
    data: any[]
}

export const AsideMenu = observer(() => {
    const {setPanelsHandler} = useContext(ViewPanelsContext)
    const {friends} = useContext(MainContext)

    // Загрузка данных для всех элементов меню
    useEffect(() => {
        Promise.all([UserFriendsController.getAllFriends()])
            .then(() => {
                const savedActiveType = localStorage.getItem('activeMenuItem')
                if (savedActiveType) {
                    setActiveElement(savedActiveType, null)
                }
            })
    }, [])

    const [viewConfiguration, setViewConfiguration] = useState<ViewConfigurationType>({data: [], mapKey: 'id'})
    useEffect(() => {
        setPanelsHandler({
            asideComponent: <AsideList dataArray={formatData(viewConfiguration.data, viewConfiguration.mapKey)} Template={viewConfiguration.asideListTemplate}/>,
            mainComponent: viewConfiguration.mainComponent
        })
    }, [viewConfiguration.data])

    useEffect(() => {
        setMenuState()
    }, [friends.friends])

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
                    asideListTemplate: FriendTemplate,
                    mainComponent: <FriendMainPanel/>,
                    data: friends.friends,
                    mapKey: 'linkId'
                })
                break;
            case 'directChats':
                setViewConfiguration({
                    mainComponent: null,
                    data: [],
                    mapKey: 'id'
                })
                break;
            // case 'groupChats':
            //     setViewConfiguration({
            //         mainComponent: null,
            //         data: [],
            //         mapKey: 'id'
            //     })
            //     break;
            // case 'videoConf':
            //     setViewConfiguration({
            //         mainComponent: null,
            //         data: [],
            //         mapKey: 'id'
            //     })
            //     break;
        }
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
                <li className="menu-item" data-name='friends'>F</li>
                <li className="menu-item" data-name='directChats'>D</li>
                <li className="menu-item" data-name='groupChats'>G</li>
                <li className="menu-item" data-name='videoConf'>V</li>
            </ul>
        </div>
    )
})