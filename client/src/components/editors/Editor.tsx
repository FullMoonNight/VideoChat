import React from 'react';
import {TextEditor} from "./text-editor/TextEditor";
import {PaintEditor} from "./paint-editor/PaintEditor";
import {on} from "socket.io-client/build/esm-debug/on";

interface Props {
    type: 'text' | 'handWr',
    value: any,
    onChange: (value: any) => void,
    size?: {
        width?: string | number,
        height?: string | number
    },
}

export const Editor = ({type, value, size, onChange}: Props) => {
    return (
        <div className='editor-wrapper' style={{
            position: "relative",
            width: size?.width ? (typeof size.width === 'string' ? size.width : size.width + 'px') : '100%',
            height: size?.height ? (typeof size.height === 'string' ? size.height : size.height + 'px') : '100%',
        }}>
            {
                type === "text" ?
                    <TextEditor value={value} onChange={onChange}/> :
                    <PaintEditor value={value} onChange={onChange}/>
            }
        </div>
    );
};