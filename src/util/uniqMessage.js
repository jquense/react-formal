
export default function uniqMessage(msg, i, list) {
  let idx = -1;
  let extract = item => item.message || item;

  msg = extract(msg);

  list.some((item, ii) => {
    if (extract(item) === msg) {
      idx = ii;
      return true
    }
  })

  return idx === i;
}
