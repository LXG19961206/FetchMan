
export type Resp = {
  data: typeof XMLHttpRequest.prototype.response,
  dataAfterTrans: unknown,
  url: string,
  method: string,
  status: typeof XMLHttpRequest.prototype.status,
  headers: Record<string, string>,
  cost: number,
  reqHeaders?: Record<string, string>,
  contentType: string
}