import ReactJson from "react-json-view";
import {RespContext, StatusContext} from "@/context";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import JsonEditor from "@/components/jsonEditor/jsonEditor";
import {createStyle, OverFlow, percent, px} from "@/style";
import {Match} from "@/components/headerless/match";
import { SmartHeaders } from "@/dicts/headers";




export const Preview = () => {

    const respCtx = useContext(RespContext)

    const statusCtx = useContext(StatusContext)

    const [imgUrl, setUrl] = useState("")

    const contentType = respCtx.respHeaders.find(([k,v]) => k === SmartHeaders.ContentType) || []

    const [_, contentTypeVal] = contentType

    useEffect(() => {

        if (!/.*image.*/.test(contentTypeVal)) return

        setUrl(`http://localhost:${statusCtx.port}/${respCtx.respBodyPath}`)

        console.log(imgUrl)

    }, [respCtx.respBody])

    return (
        <Match fallback={<pre> { respCtx.respBody as string } </pre>}>
            <Match.Option when={ /application\/json/.test(contentTypeVal) }>
                <JsonEditor
                    height={"inherit"}
                    json={respCtx.respBody as string}
                    viewMode>
                </JsonEditor>
            </Match.Option>
            <Match.Option when={ /text\/html/.test(contentTypeVal) }>
                <iframe
                    style={{ resize: 'both' }}
                    srcDoc={ respCtx.respBody as string }>
                </iframe>
            </Match.Option>
            <Match.Option when={/.*image.*/.test(contentTypeVal)}>
                <img src={imgUrl} alt=""/>
            </Match.Option>
        </Match>
    )
}

const style = {
    preview: createStyle({
        height: `calc(${percent(100)} - ${px(40)})`,
        width: percent(100),
        overflow: OverFlow.auto,
    })
}