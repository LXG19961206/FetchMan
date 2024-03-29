import { RequestMethod } from '@/dicts/methods';
import { getTimeStamp } from './time';
import { ContentType } from '@/dicts/contentType';
import { contains } from './native';
import { RequestInfo } from '@/models/request'
import { GetBaseUrl } from "~/go/app/App"
import { Resp } from '@/models/resp';
import { SmartHeaders } from '@/dicts/headers';

const UNSAFE_HEADER = new Set<string>(["Accept-Encoding", "Connection", "Content-Length", "Origin"])

let baseUrl = ""



const initConfig = async () => {
  if (baseUrl) {
    return 
  }
  baseUrl = await GetBaseUrl()
}

export const request = async (
  req: RequestInfo
): Promise<Resp> => {
  await initConfig()
  return new Promise((resolve, reject) => {
    
    const xhr = new XMLHttpRequest();
    
    xhr.open(RequestMethod.Get, `${baseUrl}/${req.id}`);
    
    if (req.headers) {
      Object.entries(req.headers).forEach(([key, val]) => {
        if (!key || UNSAFE_HEADER.has(key)) return 
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

