
export function convertStr2Int (obj, attrs) {
  const newObj = Object.assign({}, obj)
  attrs.map((k) => {
    const parse = parseInt(newObj[k], 10)
    isNaN(parse) ? delete newObj[k] : newObj[k] = parse
  })
  return newObj
}
