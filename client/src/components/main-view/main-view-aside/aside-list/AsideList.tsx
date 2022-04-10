import React, {FunctionComponent} from "react";
import './AsideList.css'

interface Props<T, R, P> {
    Template: FunctionComponent<T>,
    dataList: R[]
    props: P
}

export const AsideList = <T extends { data: { id: string }, props: {} }, R extends T["data"], P extends T["props"]>({Template, dataList, props}: Props<T, R, P>) => {
    if (!Template) return <h2>List is empty</h2>


    return (
        <div className='aside-list'>
            {dataList.map(e => (
                // @ts-ignore
                <Template key={e.id} data={e} props={props}/>
            ))}
        </div>
    )

}