import ReactJson from "react-json-view";
import {RespContext} from "../../context";
import {useContext, useMemo} from "react";
import JsonEditor from "../../components/jsonEditor";
import {createStyle, OverFlow, percent, px} from "../../style";
import {Match} from "../../components/match";


export const Preview = () => {

    const respCtx = useContext(RespContext)

    const contentType = respCtx.respHeaders.find(([k,v]) => k === "Content-Type") || []

    const [_, contentTypeVal] = contentType

    const imgUrl = useMemo(() => {
        if (!/.*image.*/.test(contentTypeVal)) return ''
        return URL.createObjectURL(new Blob([respCtx.respBody as string], {
            type: "image/jpeg"
        }))
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