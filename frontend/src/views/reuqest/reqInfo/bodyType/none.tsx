import { useRequestStore } from "@/store/request"
import { Empty } from "@douyinfe/semi-ui"
import { useEffect } from "react"
import { IconEmpty } from '@douyinfe/semi-icons-lab'

export const None = () => {

  const  reqStore =  useRequestStore()

  useEffect(() => {
    reqStore.setHeader('Content-Type', "")
    reqStore.setBinaryState(false)
    reqStore.setFormDataState(false)
    reqStore.setBody(null)
  }, [])

  return (
    <Empty 
      image={<IconEmpty style={{ fontSize: '90px' }} size="large"></IconEmpty>}
      style={{ marginTop: '50px' }}
      description="With No Body">
    </Empty>
  )
}