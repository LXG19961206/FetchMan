import { Tag } from '@douyinfe/semi-ui'
import { TagColor } from '@douyinfe/semi-ui/lib/es/tag'

const MethodColor = {
  GET: `green`,
  POST: `yellow`,
  PUT: `purple`,
  DELETE: `red`,
  PATCH: `pink`,
  OPTIONS: `grey`,
  HEAD: `light-blue`,
  CONNECT: `violet`,
  TRACE: `orange`,
} as { [key: string]: string }

type Props = { method: string }

export default ({ method }: Props) => {
  return (
    <Tag color={MethodColor[method] as TagColor}> { method } </Tag>
  ) 
}