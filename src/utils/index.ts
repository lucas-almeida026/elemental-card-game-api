const charactersToMakeId = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const makeId = (length: number, result = ''): string => {
  if(result.length === length) return result
  return makeId(length, result += charactersToMakeId.charAt(Math.floor(Math.random() * charactersToMakeId.length)))
}

