import Editor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import './editorTheme.css'
import {createStyle, percent, px} from "../style";
import {useEffect, useMemo, useRef} from "react";


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

    const jsonValue = useMemo(() => {
        try {
            return JSON.parse(props.json)
        } catch (err) {
            return {}
        }
    }, [props.json])

    useEffect(() => {

        if (!wrapper.current) return

        const editor = new Editor(wrapper.current, {
            mode: "code",
            limitDragging: true,
            navigationBar: true,
            mainMenuBar: false,
            statusBar: false,
            onChange () {
                props.onChange?.call(void 0, editor.getText())
            },
            onBlur () {
                props.onBlur?.call(void 0, editor.getText())
            }
        })


        setTimeout(() => {

            editor.aceEditor.setFontSize("12px");

            const textarea = document.querySelector("textarea.ace_text-input")

            if (props.viewMode && textarea) {
                editor.aceEditor.setReadOnly(true)
            }


        })

        editor.set(jsonValue)

        return () => {
            editor.destroy()
        }

    }, [wrapper])

    return (
        <div
            ref={wrapper}
            style={{...style.wrapper, height: props.height, width: props.width }}>
        </div>
    )

}

const style = {
    wrapper: createStyle({
        width: percent(100)
    }),
}

