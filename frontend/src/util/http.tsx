import { RequestMethod } from '@/dicts/methods';
import { GetBaseUrl, GetSpecialFields } from '~/go/app/App'
import { getTimeStamp } from './time';
import { ContentType } from '@/dicts/contentType';
import { contains } from './native';
import { RequestInfo } from '@/models/request'
import { isNil } from 'lodash';


let baseUrl = ""

let fakeFields = {
  Method: "", Url: "", Time: ""
}

const initConfig = async () => {
  if (baseUrl && fakeFields.Method) {
    return 
  }
  fakeFields = await GetSpecialFields()
  baseUrl = await GetBaseUrl()
}

export const request = async (
  req: RequestInfo
) => {
  console.log(req)
  await initConfig()
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(RequestMethod.Post, baseUrl);
    xhr.setRequestHeader(fakeFields.Url, req.url)
    xhr.setRequestHeader(fakeFields.Method, req.method)

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
        resolve({
          data: xhr.response,
          dataAfterTrans: bodyParse(
            xhr.response,
            xhr.getResponseHeader("Content-Type") || ''
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

