import { createContext } from 'react'


export type Params = {
  key: number,
  Key: string,
  Value: string,
  Description: string
}[]

export type ReqBody = {
  Type: string,
  Value?: string,
  FileId?: string,
  FilePath?: string,
  Name?: string,
  FormData?: ReqBody []
} | null

export type ReqInsantcePayload = {
  Id: number,
  Url: string;
  Method: string;
  Headers: string[][];
  Body: ReqBody;
}



export const ReqContext = createContext<{
  id: number,
  setId: (id: number) => void,
  body: ReqBody,
  method: string,
  setMethod: (method: string) => void,
  params: Record<string, string>,
  headers: string [] [],
  url: string,
  setBody: (body: ReqBody) => void
  setUrl: (url: string) => void
  setParams: (params: Record<string, string>) => void
  setHeaders: (headers: string [][]) => void
  setContentType: (v: string) => void,
  getContentType: () => string,
  createReqPayload: () => ReqInsantcePayload | null,
  updateTabInfo: () => void,
}>({
  id: 0,
  setId (id: number) {},
  createReqPayload () { return null  },
  setContentType (v: string) {},
  body: null,
  method: '',
  setMethod (method: string) {},
  params: {},
  headers: [],
  url: "",
  setBody (body: unknown) {},
  setUrl(url: string) {},
  setParams(params: Record<string, string>) {},
  setHeaders(headers: string [][]) {},
  getContentType () { return "" },
  updateTabInfo () {}
})


