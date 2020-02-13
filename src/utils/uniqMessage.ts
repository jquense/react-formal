let extract = (item: any) => item.message || item

export default function uniqMessage(msg: any, i: number, list: any[]) {
  let idx = -1

  msg = extract(msg)

  list.some((item, ii) => {
    if (extract(item) === msg) {
      idx = ii
      return true
    }
  })

  return idx === i
}
