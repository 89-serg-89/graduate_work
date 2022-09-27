export const serialize = (template: string[], data: object = {}): object => {
  const res = {}
  template.forEach(i => {
    if (data[i]) {
      res[i] = i === 'id' ? data[i].toString() : data[i]
    }
  })
  return res
}
