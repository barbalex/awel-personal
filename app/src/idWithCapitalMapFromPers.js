import sortBy from 'lodash/sortBy'

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

export default ({ personen, field = 'name' }) => {
  const res = []
  let personenToUse =
    field === 'kurzzeichen'
      ? sortBy(personen, p => p.kurzzeichen.toLowerCase())
      : personen
  personenToUse.forEach(p => {
    const firstChar = p[field].charAt(0).toUpperCase()
    while (firstChar >= alphabet[0]) {
      res.push(alphabet.shift())
    }
    res.push(p.id)
  })
  return res
}
