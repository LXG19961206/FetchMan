import { request } from '~/go/models'


type Optional<T, K extends keyof T> =  Omit<T, K> & Partial<Pick<T, K>>

type UnnecessaryFields = (
  "id" | "body" | "createTime" | "updateTime" | "collectionId" | "bodyId" | 
  "originUrl" | "headers" | "isFormData" | "isBinary" | "headers" | "contentType" | "respId"
)

export type RequestInfo = Optional<request.RequestRecord, UnnecessaryFields>