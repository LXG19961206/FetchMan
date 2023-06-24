declare module "react-json-editor-ajrm" {

    import { JSX } from "react";

    export type EditorEventVal = { jsObject: object, json: string }

    type Editor = {
        id: string,
        children: unknown [],
        placeholder?: object,
        locale?: object,
        reset?: boolean,
        viewOnly?: boolean,
        onChange?: (evt: EditorEventVal) => void,
        onBlur?: (evt: EditorEventVal) => void,
        confirmGood?: boolean,
        height?: string,
        width?: string,
        onKeyPressUpdate?: boolean
        waitAfterKeyPress?: number,
        modifyErrorText?: function,
        colors?: Partial<{
            default: string,
            string: string,
            number: string,
            colon: string,
            keys: string,
            keys_whiteSpace: string,
            primitive: string,
            error: string,
            background: string,
            background_warning: string
        }>
    }

    export default function (props: Editor): JSX.Element
}