import React, {useEffect, useRef, useState} from 'react';
import AceEditor from "react-ace";
import './TextEditor.css'

import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-monokai'


interface Props {
    onChange: (value: string, event?: any) => void,
    value: string
}

export const TextEditor = ({value, onChange}: Props) => {
    const [theme, setTheme] = useState<'chrome' | 'monokai'>(localStorage.getItem('colorScheme') === 'dark' ? 'monokai' : 'chrome')
    const ace = useRef<any>()

    const changeThemeHandler = () => {
        setTheme(currentTheme => currentTheme === 'monokai' ? 'chrome' : 'monokai')
    }

    const clearHandler = () => {
        if (ace.current) {
            ace.current.editor.setValue('')
        }
    }

    return (
        <div className={`text-editor-wrapper ${theme}`}>
            <div className="toolbar">
                <button onClick={changeThemeHandler}>change theme</button>
                <button onClick={clearHandler}>clear</button>
            </div>
            <AceEditor
                ref={ace}
                value={value}
                onChange={onChange}
                mode='javascript'
                fontSize={14}
                placeholder={'Your code'}
                theme={theme}
                width='100%'
                style={{
                    flexGrow: 1
                }}
                setOptions={{
                    tabSize: 2,
                    enableLiveAutocompletion: true,
                    enableBasicAutocompletion: true,
                    enableSnippets: true
                }}
            />
        </div>
    )
        ;
};