import ReactJson from "react-json-view";
import { RespContext, StatusContext } from "@/context";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import JsonEditor from "@/components/jsonEditor/jsonEditor";
import { createStyle, OverFlow, percent, px } from "@/style";
import { Match } from "@/components/headerless/match";
import { useRespStore } from "@/store/resp";


export const Preview = () => {

    const respStore = useRespStore()

    const [imgUrl, setUrl] = useState("")

    useEffect(() => {

        const contentTypeVal = respStore.currentViewResp?.contentType as string

        if (!/.*image.*/.test(contentTypeVal)) return

        const blob = new Blob([respStore.currentViewResp?.data], { type: contentTypeVal })

        setUrl(URL.createObjectURL(blob))

    }, [respStore.currentViewResp?.data])

    return (
        <Match fallback={<pre> {respStore.currentViewResp?.data as string} </pre>}>
            <Match.Option when={/application\/json/.test(respStore.currentViewResp?.contentType as string)}>
                <JsonEditor
                    height={"inherit"}
                    json={respStore.currentViewResp?.data as string}
                    viewMode>
                </JsonEditor>
            </Match.Option>
            <Match.Option when={/text\/html/.test(respStore.currentViewResp?.contentType as string)}>
                <iframe
                    style={{ resize: 'both' }}
                    srcDoc={respStore.currentViewResp?.data as string}>
                </iframe>
            </Match.Option>
            <Match.Option when={/.*image.*/.test(respStore.currentViewResp?.contentType as string)}>
                <img src={imgUrl} alt="" />
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