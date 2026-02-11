const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

/**
 * Приводит дату к единому формату "Месяц Год" (например, "Январь 2024").
 * Если строка в формате YYYY-MM-DD — парсит и форматирует, иначе возвращает как есть.
 */
export function useFormatMethodDate() {
  function formatMethodDate(dateStr: string | undefined): string {
    if (!dateStr?.trim()) return ''
    const trimmed = dateStr.trim()
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (isoMatch) {
      const [, year, month] = isoMatch
      const monthIndex = parseInt(month, 10) - 1
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${MONTHS[monthIndex]} ${year}`
      }
    }
    return trimmed
  }
  return { formatMethodDate }
}
