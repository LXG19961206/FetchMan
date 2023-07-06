import {Colors, createStyle, OverFlow, percent, Position, px, vh} from "../../style"
import {border, FlexCenter} from "../../style/common"
import RequestTags from "../requestTags"
import MethodsSelector from "../methodsSelector"
import RequestParams from "../requestParams"
import {ReqBody, ReqContext, RespContext, StatusContext} from '../../context'
import ResponseView from "../responseView"
import {Spin} from "@douyinfe/semi-ui"
import {Size} from "../../dicts"
import {useContext, useEffect, useState} from "react"
import {RenderIf} from "../../components/renderIf";
import {GetPort} from "../../../wailsjs/go/app/App";


export default () => {
    const [size, setSize] = useState({
        width: window.innerWidth, height: window.innerHeight
    })
    const [port,setPort] = useState(0)
    const [method, setMethod] = useState("")
    const [headers, setHeaders] = useState<string [][]>([])
    const [body, setBody] = useState<ReqBody>(null)
    const [params, setParams] = useState<Record<string, string>>({})
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [showRespShowState, setRespShowState] = useState(false)
    const [respProto, setProto] = useState("")
    const StatusStore = { port, setPort , size, setSize,loading, setLoading, showRespShowState, setRespShowState}
    const ReqStore = {
        method,
        setMethod,
        body,
        params,
        url,
        headers,
        setBody,
        setParams,
        setUrl,
        setHeaders,
        getContentType() {
            const target = this.headers.find(item => item[0] === "Content-Type")
            return target ? target[1] : ""
        },
        setContentType(val: string) {
            this.setHeaders([
                ...this.headers.filter(([key, _]) => key !== "Content-Type"),
                ["Content-Type", val]
            ])
        }
    }

    const [respBody, setRespBody] = useState<unknown>(null)
    const [respHeaders, setRespHeaders] = useState<string [][]>([])
    const [status, setStatus] = useState("")
    const [code, setCode] = useState(0)
    const [respBodyPath, setBodyPath] = useState("")
    const RespStore = {
        respBody,
        respBodyPath,
        respProto,
        respHeaders,
        respStatus: status,
        respStatusCode: code,
        setProto,
        setRespBody: setRespBody,
        setRespHeaders: setRespHeaders,
        setRespStatus: setStatus,
        setRespCode: setCode,
        setBodyPath,
        respReset() {
            setRespBody(null)
            setRespHeaders([])
            setStatus("")
            setCode(0)
        }
    }

    useEffect(() => {
        GetPort().then(setPort)
    },[])

    return (
        <StatusContext.Provider value={StatusStore}>
            <ReqContext.Provider value={ReqStore}>
                <RespContext.Provider value={RespStore}>
                    <Content></Content>
                </RespContext.Provider>
            </ReqContext.Provider>
        </StatusContext.Provider>
    )
}

export const Content = () => {

    const statusCtx = useContext(StatusContext)

    useEffect(() => {
        document.documentElement.addEventListener('resize', () => {
            statusCtx.setSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }, { once: true })
    })

    return (
        <div style={style.wrapper}>
            <RenderIf when={statusCtx.showRespShowState}>
                <ResponseView></ResponseView>
            </RenderIf>
            <MethodsSelector></MethodsSelector>
            <RequestParams></RequestParams>
        </div>

    )

}


const style = {
    wrapper: createStyle({
        width: percent(100)
    })
}