import {BodyTypeDict} from "@/dicts/body";
import React, {Fragment,useContext, useEffect, useMemo, useRef, useState} from "react";
import { Radio, RadioGroup, Button, Tag, Image, Space, TextArea } from '@douyinfe/semi-ui';
import AttrsTable, {Source} from "./attrsTable";
import MulFormData, {MulFormSource} from "./formData";
import {ReqContext} from "@/context";
import { stringify, parse } from 'qs'
import {NativeFileDialog} from "~/go/app/App";
import {RenderIf} from "@/components/headerless/renderIf";
import Editor from '@/components/jsonEditor/jsonEditor';
import {BoxSizing, Colors, createStyle, Cursor, OverFlow, px} from "@/style";
import {border, marginY} from "@/style/common";
import StrategyPattern from "@/components/headerless/strategyPattern";

export const Body = () => {

    const [bodyType, setBodyType] = useState("")

    return (
        <>
            <RadioGroup
                value={bodyType}
                onChange={e => setBodyType(e.target.value)}>
                {
                    Object.entries(BodyTypeDict).map(([type, value]) => (
                        <Radio key={type} value={value}> { value } </Radio>
                    ))
                }
            </RadioGroup>
            <br/>
            <BodyHandleView bodyType={bodyType}></BodyHandleView>
        </>
    )


}

const BodyHandleView = (props: { bodyType: string }) => {

    const strategies = {
        [BodyTypeDict.binary]: Binary,
        [BodyTypeDict.form]: Form,
        [BodyTypeDict.json]: Json,
        [BodyTypeDict.formData]: MulForm,
        default: Fragment
    }

    return (
        <StrategyPattern
            strategies={strategies}
            value={props.bodyType}>
        </StrategyPattern>
    )
}

const Json = () => {

    const reqCtx = useContext(ReqContext)

    const sync = (newVal: string) => {

        reqCtx.setContentType("application/json")

        reqCtx.setBody({
            Type: BodyTypeDict.json,
            Value: newVal
        })
    }

    return (
        <div style={style.editor}>
            <Editor
                height={"400px"}
                onBlur={sync}
                editMode
                json={reqCtx.body?.Value || ""}>
            </Editor>
        </div>
    )

}

const Binary = () => {

    const reqCtx = useContext(ReqContext)

    const cvs = useRef<HTMLCanvasElement>(null)

    const [base64, setBase64] = useState("")

    const [path, setPath] = useState("")

    const cancel = () => {
        setPath("")
        reqCtx.setContentType("")
        setBase64("")
        reqCtx.setBody(null)
    }

    const upload = () => {
       cancel()
       NativeFileDialog({}, false).then(res => {
           setPath(res.path)
           reqCtx.setContentType(res.content_type)
           setBase64(res.file)
           reqCtx.setBody({
               Type: BodyTypeDict.binary,
               FilePath: res.path,
               FileId: res.id
           })
       })
    }


    const shouldShowAsImage = useMemo(() => {

        console.log(!!base64 && /.*(image|video).*/.test(reqCtx.getContentType()))

        return !!base64 && /.*(image|video).*/.test(reqCtx.getContentType())

    }, [base64])


    return (
        <Space vertical align={"start"}>
            <br/>
            <RenderIf when={!!path}>
                <Tag onClose={cancel} closable size={"large"}> { path } </Tag>
            </RenderIf>
            <RenderIf when={shouldShowAsImage}>
                <Image width={400} src={`data:${reqCtx.getContentType()};base64,${base64}`} />
            </RenderIf>
            <Button
                onClick={upload}
                type={"primary"}>
                upload
            </Button>
        </Space>
    )
}

const Form = () => {

    const reqCtx = useContext(ReqContext)

    const formHandler = (source: Source) => {

        const urlencoded = stringify(source.filter(item => item.Key)
            .reduce((prev, item) => ({
                ...prev, [item.Key]: item.Value
            }), {}))

        reqCtx.setBody({
            Type: BodyTypeDict.form,
            Value: urlencoded
        })

        reqCtx.setContentType("application/x-www-form-urlencoded")

    }

    const getter = useMemo((): Source => {
        if (reqCtx.body?.Type === BodyTypeDict.form) {
            return Object.entries(parse(reqCtx.body.Value || '')).map(([k,v], i) => ({
                key: i, Key: k, Value: v as string, Description: ""
            }))
        } else {
            return []
        }
    }, [reqCtx.body])


    return <AttrsTable getter={getter} syncHandler={formHandler}></AttrsTable>

}

const MulForm = () => {

    const reqCtx = useContext(ReqContext)

    const mulFormHandler = (source: MulFormSource) => {
        reqCtx.setBody({
            Type: BodyTypeDict.formData,
            FormData: source.filter(item => item.Type)
                .map(item => ({
                    Type: item.Type,
                    Value: item.Value,
                    Name: item.Key,
                    FilePath: item.Type === BodyTypeDict.binary ? item.Value : ""
                }))
        })
    }

    const getter = useMemo(() => {
        if (reqCtx.body?.Type !== BodyTypeDict.formData) {
            return []
        } else if (!reqCtx.body.FormData || !reqCtx.body.FormData.length) {
            return []
        } else {
            return reqCtx.body.FormData
                .filter(item => !!item && item.Name && item.Type)
                .map((item,i) => ({
                Type: item?.Type,
                Key: item?.Name,
                key: i, Description: '',
                Value: item?.Type ===  BodyTypeDict.binary ? item?.FilePath : item?.Value
            }))
        }
    }, [reqCtx.body]) as MulFormSource

    return <MulFormData getter={getter} syncHandler={mulFormHandler}></MulFormData>

}


const style = {
    editor: createStyle({
        fontSize: px(14),
        marginTop: px(10),
        background: Colors.Transparent,
        boxSizing: BoxSizing.borderBox,
        border: border(px(1), "#ddd"),
        overflow: OverFlow.hidden,
        borderRadius: px(8),
    }),
    info: createStyle({
        padding: 0,
        ...marginY(8),
        fontSize: px(14),
        lineHeight: 1.5,
        color: "#aaa"
    })
}

