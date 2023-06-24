import { createContext } from 'react'



export const RespContext = createContext<{
    respBody: unknown,
    respHeaders: string [][],
    respStatus: string,
    respStatusCode: number,
    setRespBody: (body: unknown) => void,
    setRespHeaders: (headers: string [][]) => void,
    setRespStatus: (status: string) => void,
    setRespCode: (code: number) => void
    respReset: () => void
}>({
    respBody: null,
    respHeaders: [],
    respStatus: '',
    respStatusCode: 0,
    setRespBody (body: unknown) {},
    setRespHeaders (headers: string [][]) {},
    setRespStatus (status: string) {},
    setRespCode (code: number) {},
    respReset () {}
})
