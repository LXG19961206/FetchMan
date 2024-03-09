import ReactJson from "react-json-view";
import { RespContext, StatusContext } from "@/context";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import JsonEditor from "@/components/jsonEditor/jsonEditor";
import { createStyle, OverFlow, percent, px } from "@/style";
import { Match } from "@/components/headerless/match";
import { useRespStore } from "@/store/resp";
import { Resp } from "@/models/resp";


export const Preview = (
) => {

    const respStore = useRespStore()
    const resp = respStore.currentView!
    const [imgUrl, setUrl] = useState("")

    useEffect(() => {
        const contentTypeVal = resp.contentType as string
        if (!/.*image.*/.test(contentTypeVal)) return
        const blob = new Blob([resp.data], { type: contentTypeVal })
        setUrl(URL.createObjectURL(blob))
    }, [resp.data])

    return (
        <Match fallback={<pre> {resp.data as string} </pre>}>
            <Match.Option when={/application\/json/.test(resp.contentType as string)}>
                <JsonEditor
                    height="auto"
                    json={resp.data as string}
                    viewMode>
                </JsonEditor>
            </Match.Option>
            <Match.Option when={/text\/html/.test(resp.contentType as string)}>
                <iframe
                    style={{ resize: 'both', width: '100%', height: 'inherit' }}
                    srcDoc={resp.data as string}>
                </iframe>
            </Match.Option>
            <Match.Option when={!!imgUrl && /.*image.*/.test(resp.contentType as string)}>
                <img src={imgUrl} alt="" />
            </Match.Option>
        </Match>
    )
}

