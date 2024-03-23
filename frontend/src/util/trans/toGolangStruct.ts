import { isArray, isJsonBaseType,isPlainObject, typeDict  } from '../type'
import { firstLetterToUpper } from '../native'
import shortid from 'shortid'

const jsGolangTypeMap = {
  string: 'string',
  number: 'float64',
  boolean: 'bool',
  array: 'array',
  null: 'interface{}',
  unknown: 'interface{}',
  undefined: 'interface{}'
} as Record<string, string>

const getType = (target: unknown) => {
  return jsGolangTypeMap[
    Object.prototype.toString.call(target).replace(/\[object\s([^\]]+)\]/, "$1").toLowerCase()
  ]
}

export const getValueGolangStruct = (record: unknown, isRoot = true, name = "", children: string [] = []): string => {

  if (isJsonBaseType(record)) {
    const retType = (record === null || record === undefined)
      ? jsGolangTypeMap[typeDict.unknown]
      : getType(record)
    return isRoot ? AddSign(retType, name, false) : retType
  } else if (isPlainObject(record)) {
    const items = []
    for (let key in record) {
      const golangTag = `\ \ \`json:"${key}"\``
      const golangPublicKey = firstLetterToUpper(key)
      let value = record[key]
      if (isJsonBaseType(value)) {
        const typeOfValue = getValueGolangStruct(value, false, "", children)
        items.push(`${golangPublicKey} ${typeOfValue} ${golangTag}`)
      } else if (isArray(value)) {
        items.push(`${golangPublicKey} ${getValueGolangStruct(value, false, name, children)} ${golangTag}`)
      } else if (isPlainObject(value)) {
        const childName = 'Type' + firstLetterToUpper(key)
        const child = getValueGolangStruct(value, true, childName)
        children.push(child)
        items.push(`${golangPublicKey} ${childName} ${golangTag}`)
      }
    }

    const childrenStr = children.filter(child => child).map(child => (
      child + '\n\n'
    )).join('')

    const finalType = items.reduce((prev, current, idx) => {
      if (idx === items.length - 1) {
        return prev + `\ \ ${current}\n}`
      } else {
        return prev + `\ \ ${current}\n`
      }
    }, `{\n`)

    return isRoot ? childrenStr + AddSign(finalType, name, true) : finalType

  } else if (isArray(record)) {
    let ret = ""
    const firstChild = record[0]
    if (isJsonBaseType(firstChild)) {
      const typeofFirst = getValueGolangStruct(firstChild, false, name, children)
      ret = createGolangArray(typeofFirst)
    } else if (isPlainObject(firstChild)) {
      const childName = 'TypeArrayItem' + (shortid.generate())
      const childType = getValueGolangStruct(firstChild, true, childName)
      children.push(childType)
      ret = createGolangArray(childName)
    } else {
      const childType = getValueGolangStruct(firstChild, true, name)
      ret = createGolangArray(childType)
    }

    const childrenStr = children.filter(child => child).map(child => (
      child + '\n\n'
    )).join('')

    return isRoot ? childrenStr + AddSign(ret) : ret
  }
  return ''
}


const AddSign = (content: string, name?: string, isStruct?: boolean) => {
  if (isStruct) {
    return `type ${name || 'TypeRet'} struct ${content}`
  }
  return `type ${name || 'TypeRet'} = ${content} `
}



const createGolangArray = (type: string) => {
  return `[]${type}`
}