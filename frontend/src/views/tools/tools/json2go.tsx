import { go } from '@codemirror/legacy-modes/mode/go';
import { getValueGolangStruct } from '@/util/trans/toGolangStruct'

import Transfer from './jsonTransfer'

export default () => {
  return (
    <Transfer lang={go} transfer={getValueGolangStruct}></Transfer>
  )
}