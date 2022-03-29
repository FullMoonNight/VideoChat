import React, {FunctionComponent, ReactElement} from "react";
import './AsideList.css'

interface Props<T> {
    dataArray: T[],
    Template?: FunctionComponent<{ data: T }>,
}

export const AsideList = <T extends { id: string }>({dataArray, Template}: Props<T>) => {
    if (!Template) return null


    return (
        <div className='aside-list'>
            {dataArray.map(e => (
                <Template key={e.id} data={e}/>
            ))}
        </div>
    )

}