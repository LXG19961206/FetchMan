import { RequestMethod } from "@/dicts/methods"

export type RequestInfo = {
  url: string,
  id: string,
  method: RequestMethod,
  headers?: Record<string, string>,
  body?: unknown
}