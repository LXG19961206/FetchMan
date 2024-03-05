import { RequestMethod } from '@/dicts/methods';
import { getTimeStamp } from './time';
import { ContentType } from '@/dicts/contentType';
import { contains } from './native';
import { RequestInfo } from '@/models/request'
import { GetBaseUrl, GetSpecialFields } from "~/go/app/App"
import { app } from '~/go/models'
import { Resp } from '@/models/resp';
import { SmartHeaders } from '@/dicts/headers';


let baseUrl = ""

let fakeFields = {
  method: "", url: "", times: "", isBinary: "", isFormData: ""
} as app.SpecialReqHeaderFields

const initConfig = async () => {
  if (baseUrl && fakeFields.method) {
    return 
  }
  fakeFields = await GetSpecialFields()
  console.log(fakeFields)
  baseUrl = await GetBaseUrl()
}

export const request = async (
  req: RequestInfo
): Promise<Resp> => {
  await initConfig()
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(RequestMethod.Post, baseUrl);
    xhr.setRequestHeader(fakeFields.url, req.url)
    xhr.setRequestHeader(fakeFields.method, req.method)

    if (req.isBinary) {
      xhr.setRequestHeader(fakeFields.isBinary, "1")
    }

    if (req.isFormData) {
      xhr.setRequestHeader(fakeFields.isFormData, "1")
    }

    if (req.headers) {
      Object.entries(req.headers).forEach(([key, val]) => {
        if (!key) return 
        xhr.setRequestHeader(key, val)
      })
    }

    xhr.send(req.body as XMLHttpRequestBodyInit);

    const startTime = getTimeStamp()

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const contentType = xhr.getResponseHeader(SmartHeaders.ContentType) || ''
        resolve({
          data: xhr.response,
          contentType: contentType,
          dataAfterTrans: bodyParse(
            xhr.response,
            contentType
          ),
          url: req.url,
          method: req.method,
          status: xhr.status,
          headers: formatRespHeaders(xhr.getAllResponseHeaders()),
          cost: Math.floor((getTimeStamp() - startTime)),
        })
      }
    };

    xhr.onerror = () => {
      reject(xhr.response)
    }
    
  })
}

export const formatRespHeaders = (headers: string) => {
  return headers.split('\r\n')
    .filter(header => header)
    .reduce((prev, item) => {
      const [k, v] = item.split(':')
      return {
        ...prev, [k]: v.trim()
      }
    }, {})
}

export const bodyParse = (
  body: typeof XMLHttpRequest.prototype.response,
  contentType: string
) => {
  if (contains(contentType, ContentType.Json)) {
    return JSON.parse(body)
  } else if (
    [ContentType.File, ContentType.Audio, ContentType.Video, ContentType.Image].some(
      type => contains(contentType, type)
    )
  ) {
    return new Blob([body], { type: contentType })
  } else {
    return body
  }
}

