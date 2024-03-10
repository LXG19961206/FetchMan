import { useEffect, useState } from "react";
import JsonEditor from "@/components/jsonEditor/jsonEditor";
import { Match } from "@/components/headerless/match";
import { useRespStore } from "@/store/resp";
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { xml } from '@codemirror/legacy-modes/mode/xml';
import { ContentType } from "@/dicts/contentType";


export const Preview = (
) => {

    const respStore = useRespStore()
    const resp = respStore.currentView!
    const [mediaUrl, setUrl] = useState("")

    useEffect(() => {
        const contentTypeVal = resp.contentType as string
        if (!/.*image.*/.test(contentTypeVal)) return
        const blob = new Blob([resp.data], { type: contentTypeVal })
        setUrl(URL.createObjectURL(blob))
    }, [resp.data])

    return (
        <Match fallback={<pre> {resp.data as string} </pre>}>
            <Match.Option when={resp.contentType.indexOf(ContentType.Json) > -1}>
                <JsonEditor
                    height="auto"
                    json={resp.data as string}
                    viewMode>
                </JsonEditor>
            </Match.Option>
            <Match.Option when={resp.contentType.indexOf(ContentType.XmlCommonSign) > -1}>
                <CodeMirror
                    value={resp.data}
                    height="100%"
                    extensions={[StreamLanguage.define(xml)]}
                />
            </Match.Option>
            <Match.Option when={resp.contentType.indexOf(ContentType.Html) > -1}>
                <iframe
                    style={{ resize: 'both', width: '100%', height: 'inherit' }}
                    srcDoc={resp.data as string}>
                </iframe>
            </Match.Option>
            <Match.Option when={resp.contentType.indexOf(ContentType.Image) > -1}>
                <img src={mediaUrl} alt="" />
            </Match.Option>
            <Match.Option when={resp.contentType.indexOf(ContentType.Video) > -1}>
                <video src={mediaUrl}></video>
            </Match.Option>
            <Match.Option when={resp.contentType.indexOf(ContentType.Audio) > -1}>
                <audio src={mediaUrl}></audio>
            </Match.Option>
        </Match>
    )
}

