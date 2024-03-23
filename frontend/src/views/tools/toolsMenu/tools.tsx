import { IconCode, IconImage, IconTerminal, IconClock, IconKey, IconHash } from "@douyinfe/semi-icons"
import shortid from "shortid"
import JSON2TsType from '../tools/json2ts'
import JSON2Go from '../tools/json2go'

export default ([
  {
    name: 'JSON To TypeScript Type',
    label: 'JSON To TypeScript Type',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: JSON2TsType,
    allMulOpen: true
  },
  {
    name: 'JSON To TypeScript Interface',
    label: 'JSON To TypeScript Interface',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: JSON2TsType,
    allMulOpen: true
  },
  {
    name: 'JSON To JavaScript Object',
    label: 'JSON To JavaScript Object',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'JSON To Golang Struct',
    label: 'JSON To Golang Struct',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: JSON2Go,
    allMulOpen: true
  },
  {
    name: 'JSON To Python Dict',
    label: 'JSON To Python Dict',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'JSON To XML',
    label: 'JSON To XML',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'JSON To CSV',
    label: 'JSON To CSV',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'XML To JSON',
    label: 'XML To JSON',
    id: shortid.generate(),
    icon: <IconCode></IconCode>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Format Time/Date Str',
    label: 'Format Time/Date Str',
    id: shortid.generate(),
    icon: <IconClock></IconClock>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Call System Terminal',
    label: 'Call System Terminal',
    id: shortid.generate(),
    icon: <IconTerminal></IconTerminal>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Minisize Images',
    label: 'Minisize Images',
    id: shortid.generate(),
    icon: <IconImage></IconImage>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Decode/Encode Url',
    label: 'Decode/Encode Url',
    id: shortid.generate(),
    icon: <IconHash></IconHash>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Decode/Encode Base64',
    label: 'Decode/Encode Base64',
    id: shortid.generate(),
    icon: <IconKey></IconKey>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Decode/Encode SHA256',
    label: 'Decode/Encode SHA256',
    id: shortid.generate(),
    icon: <IconKey></IconKey>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'Decode/Encode AES',
    label: 'Decode/Encode AES',
    id: shortid.generate(),
    icon: <IconKey></IconKey>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  },
  {
    name: 'To MD5',
    label: 'To MD5',
    id: shortid.generate(),
    icon: <IconKey></IconKey>,
    render: () => <div>JSON To TS Type</div>,
    allMulOpen: true
  }
])