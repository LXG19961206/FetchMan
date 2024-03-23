import shortid from 'shortid'
import { firstLetterToUpper } from './native'

export const typeDict = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  null: 'null',
  unknown: 'unknown',
  undefined: 'undefined'
}

export const getType = (target: unknown) => {
  return Object.prototype.toString.call(target).replace(/\[object\s([^\]]+)\]/, "$1").toLowerCase()
}

export const isType = (target: unknown, type: string) => {
  const upperType = firstLetterToUpper(type)
  return Object.prototype.toString.call(target) === `[object ${upperType}]`
}

export const isPlainObject = (maybeObject: unknown): maybeObject is Record<string, unknown> => {
  return isType(maybeObject, typeDict.object)
}

export const isArray = (maybeArray: unknown): maybeArray is Array<unknown> => {
  return isType(maybeArray, typeDict.array)
}

export const isJsonBaseType = (target: unknown) => {
  return [
    isType(target, typeDict.string),
    isType(target, typeDict.number),
    isType(target, typeDict.boolean),
    isType(target, typeDict.null),
    isType(target, typeDict.undefined)
  ].some(Boolean)
}


