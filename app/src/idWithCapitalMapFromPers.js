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
  /**
   * normally keep sorting by name
   * but for kurzzeichen need to sort by that
   * and needs to be lowercase
   */
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
  // add unused from alphabet
  return [...res, ...alphabet]
}
