export default ({ personen, showMutationNoetig }) =>
  personen.sort((a, b) => {
    if (showMutationNoetig) {
      if (a.mutationFrist && b.mutationFrist) {
        const aDate = new Date(a.mutationFrist)
        const bDate = new Date(b.mutationFrist)
        return aDate - bDate
      } else if (a.mutationFrist) {
        return -1
      } else if (b.mutationFrist) {
        return 1
      } else if (a.mutationNoetig && !b.mutationNoetig) {
        return -1
      } else if (!a.mutationNoetig && b.mutationNoetig) {
        return 1
      }
    }
    const nameCompared = (a.name || '').localeCompare(b.name || '', 'de-Ch')
    if (nameCompared !== 0) return nameCompared
    return (a.vorname || '').localeCompare(b.vorname || '', 'de-Ch')
  })
