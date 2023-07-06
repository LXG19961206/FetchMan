import {Button, Input, Select} from '@douyinfe/semi-ui';
import {useContext, useEffect, useState} from 'react';
import {Methods, Size} from '../../dicts';
import {BorderType, Colors, createStyle, Display, percent, px} from '../../style';
import {marginX, paddingX, Reset} from '../../style/common';
import {Params, ReqContext, RespContext, StatusContext} from '../../context'
import {stringify} from 'qs'
import {SimpleRequest, GetPort} from "../../../wailsjs/go/app/App";


export default () => {


    const reqContext = useContext(ReqContext)

    const respCtx = useContext(RespContext)

    const statusCtx = useContext(StatusContext)

    const postRequest = async () => {

        statusCtx.setLoading(true)

        const url = reqContext.url

        const finalUrl = Object.keys(reqContext.params).length
            ? url + "?" + stringify(reqContext.params)
            : url

        statusCtx.setRespShowState(true)

        let resp = await SimpleRequest({
            Url: finalUrl.trim(),
            Method: reqContext.method,
            Headers: reqContext.headers,
            Body: reqContext.body
        })

        respCtx.respReset()

        reqContext.setHeaders(resp.ReqHeaders || [])

        respCtx.setRespStatus(resp.Status)

        respCtx.setRespCode(resp.Code)

        respCtx.setRespBody(resp.Body)

        respCtx.setBodyPath(resp.BodyPath)

        respCtx.setProto(resp.Proto)

        respCtx.setRespHeaders(resp.Headers)

        statusCtx.setLoading(false)

    }

    return (
        <div style={style.wrapper}>
            <Select
                filter
                size={Size.large}
                defaultValue={Methods.get}
                onChange={ val => reqContext.setMethod(val as string) }
                style={{width: 150}}>
                {
                    Object.values(Methods).map(method => (
                        <Select.Option
                            size="large"
                            key={method}
                            value={method}> {method}
                        </Select.Option>
                    ))
                }
            </Select>
            <Input
                value={reqContext.url}
                onChange={reqContext.setUrl}
                placeholder='Please enter your url' size={Size.large}>
            </Input>
            <Button
                style={style.button}
                size={Size.large}
                theme={BorderType.solid}
                onClick={postRequest}
                type='secondary'> Send
            </Button>
        </div>
    )
}

const style = {
    wrapper: createStyle({
        display: Display.flex,
        width: percent(100),
        ...Reset,
        ...paddingX(px(10))
    }),
    button: createStyle({
        ...marginX(px(4))
    })
}