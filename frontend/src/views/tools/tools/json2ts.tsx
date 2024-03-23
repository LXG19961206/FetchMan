import { typescript } from '@codemirror/legacy-modes/mode/javascript';
import { getValueTsType } from '@/util/trans/toTsType'

import Transfer from './jsonTransfer'

export default () => {
  return (
    <Transfer lang={typescript} transfer={getValueTsType}></Transfer>
  )
}