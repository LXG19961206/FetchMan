import { RenderIf } from "@/components/headerless/renderIf"
import { useRequestStore } from "@/store/request"
import { Button, Space, Tag } from "@douyinfe/semi-ui"
import { useEffect, useState } from "react"
import { GetFileUrl, NativeFileDialog, GetFilePathPlaceholder } from "~/go/app/App"

const getBaseUrlAction = GetFileUrl()
const getPlaceholderAction = GetFilePathPlaceholder()

export default () => {

  const [fileBaseUrl, setBaseUrl] = useState("")

  const [filePathPlaceholder, setPlaceholder] = useState("")


  useEffect(() => {
    getBaseUrlAction.then(setBaseUrl)
    getPlaceholderAction.then(setPlaceholder)
  }, [])

  const reqStore = useRequestStore()

  const [path, setPath] = useState("")

  const cancel = () => {
    setPath("")
    reqStore.setBinaryState(false)
    reqStore.setBody(null)
  }

  const upload = () => {
    cancel()
    NativeFileDialog({}, false).then(res => {
      reqStore.setBinaryState(true)
      reqStore.setFormDataState(false)
      reqStore.setHeader("Content-Type" ,res.ContentType)
      reqStore.setBody(`${filePathPlaceholder}${res.Path}`)
      setPath(res.Path)
    })
  }
  return (
    <Space vertical align={"start"}>
      <br />
      <img src={fileBaseUrl + (path)} alt="" />
      <RenderIf when={!!path}>
        <Tag onClose={cancel} closable size={"large"}> {path} </Tag>
      </RenderIf>
      <Button
        onClick={upload}
        type={"primary"}>
        upload
      </Button>
    </Space>
  )
}