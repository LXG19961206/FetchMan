import { isArray, isJsonBaseType,isPlainObject, typeDict, getType  } from '../type'
import { firstLetterToUpper } from '../native'
import shortid from 'shortid'
export const getValueTsType = (record: unknown, isRoot = true, name = "", children: string[] = []) => {
  if (isJsonBaseType(record)) {
    const retType = (record === null || record === undefined)
      ? typeDict.unknown
      : getType(record)
    return isRoot ? AddSignTsType(retType, name) : retType
  } else if (isPlainObject(record)) {
    const items = []
    for (let key in record) {
      let value = record[key]
      if (isJsonBaseType(value)) {
        const typeOfValue = getValueTsType(value, false, "", children)
        items.push(`${key}: ${typeOfValue}`)
      } else if (isArray(value)) {
        items.push(`${key}: ${getValueTsType(value, false, name, children)}`)
      } else if (isPlainObject(value)) {
        const childName = 'Type' + firstLetterToUpper(key)
        const child = getValueTsType(value, true, childName)
        children.push(child as string)
        items.push(`${key}: ${childName}`)
      }
    }

    const childrenStr = children.filter(child => child).map(child => (
      child + '\n\n'
    )).join('')

    const finalType: string = items.reduce((prev, current, idx) => {
      if (idx === items.length - 1) {
        return prev + `\ \ ${current}\n}`
      } else {
        return prev + `\ \ ${current},\n`
      }
    }, `{\n`)

    return isRoot ? childrenStr + AddSignTsType(finalType, name) : finalType

  } else if (isArray(record)) {
    let ret = ""
    const firstChild = record[0]
    if (isJsonBaseType(firstChild)) {
      const typeofFirst = getValueTsType(firstChild, false, name, children)
      ret = createTsArray(typeofFirst as string)
    } else if (isPlainObject(firstChild)) {
      const childName = 'TypeArrayItem' + (shortid.generate())
      const childType = getValueTsType(firstChild, true, childName)
      children.push(childType as string)
      ret = createTsArray(childName)
    } else {
      const childType = getValueTsType(firstChild, true, name)
      ret = createTsArray(childType as string)
    }

    const childrenStr = children.filter(child => child).map(child => (
      child + '\n\n'
    )).join('')

    return isRoot ? childrenStr + AddSignTsType(ret) : ret
  }
  return ''
}

export const AddSignTsType = (content: string, name?: string) => {
  return `type ${name || 'TypeRet'} = ${content}`
}

export const createTsArray = (type: string) => {
  return `Array<${type}>`
}