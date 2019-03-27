const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

export default personen => {
  const res = []
  personen.forEach(p => {
    const firstChar = p.name.charAt(0).toUpperCase()
    while (firstChar >= alphabet[0]) {
      res.push(alphabet.shift())
    }
    res.push(p.id)
  })
  return res
}
