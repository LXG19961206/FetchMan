import Editor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import './editorTheme.css'
import style from './editor.module.css'
import {useEffect, useMemo, useRef} from "react";
import JSONEditor from 'jsoneditor';


export default (props: {
    width?: string,
    height?: string,
    json: string,
    children?: unknown [],
    onChange?: (json: string) => void,
    onBlur?: (json: string) => void,
    editMode?: boolean,
    viewMode?: boolean
}) => {

    const wrapper = useRef<HTMLDivElement>(null)
    const editor = useRef<JSONEditor>()
    useEffect(() => {
        if (wrapper.current) {
            try {
                const val = JSON.parse(props.json)
                editor.current?.set(val)
            } catch {
    
            }
        }
    }, [props.json, wrapper.current])

    useEffect(() => {
        
        if (!wrapper.current) return
        
        editor.current = new Editor(wrapper.current, {
            mode: "code",
            limitDragging: true,
            navigationBar: true,
            mainMenuBar: false,
            statusBar: false,
            onChange () {
                props.onChange?.call(void 0, editor.current?.get())
            },
            onBlur () {
                props.onBlur?.call(void 0, editor.current?.get())
            }
        })

        setTimeout(() => {
            if (props.viewMode) {
                editor.current?.aceEditor.setReadOnly(true)
            }
        }, 200)

        try {
            editor.current?.set(JSON.parse(props.json))
        } finally {
            return () => {
                editor.current?.destroy()
            }
        }

    }, [wrapper])

    return (
        <div
            ref={wrapper}
            className={style.wrapper}
            style={{ height: props.height, width: props.width }}>
        </div>
    )

}

