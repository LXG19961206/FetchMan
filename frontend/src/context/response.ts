import { createContext } from 'react'



export const RespContext = createContext<{
    respBody: unknown,
    respHeaders: string [][],
    respStatus: string,
    respBodyPath: string,
    respStatusCode: number,
    setRespBody: (body: unknown) => void,
    setRespHeaders: (headers: string [][]) => void,
    setRespStatus: (status: string) => void,
    setBodyPath: (status: string) => void,
    setRespCode: (code: number) => void
    respReset: () => void
}>({
    respBody: null,
    respBodyPath: "",
    respHeaders: [],
    respStatus: '',
    respStatusCode: 0,
    setBodyPath (status: string) {},
    setRespBody (body: unknown) {},
    setRespHeaders (headers: string [][]) {},
    setRespStatus (status: string) {},
    setRespCode (code: number) {},
    respReset () {}
})
