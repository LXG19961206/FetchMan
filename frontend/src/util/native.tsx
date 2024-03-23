export const contains = (str: string, sub: string) => {
  return str.indexOf(sub) !== -1
}

export const firstLetterToUpper = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const json2Js = (maybeJson: string) => {
  try {
    return JSON.parse(maybeJson)
  } catch (err) {
    return null
  }
}