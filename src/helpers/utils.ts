export const serialize = (template: string[], data: object = {}): object => {
  const res = {}
  template.forEach(i => {
    if (data[i]) {
      const isId = ['id', '_id'].includes(i)
      res[isId ? 'id' : i] = isId ? data[i].toString() : data[i]
    }
  })
  return res
}
