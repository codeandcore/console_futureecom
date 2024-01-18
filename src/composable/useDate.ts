export const useDate = (): UseDate => {
  const formatDate = (value: string): string => {
    if (!value) {
      return ''
    }

    try {
      const replaced = new Date(value.replace(/ /g, 'T'))
      const date = replaced.toISOString().slice(0, 10)
      const time = replaced.toISOString().slice(11, 19)
      return `${date} ${time}`
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  const getTime = (date: string): string => {
    const time = date.split(' ')[1] || ''
    return !time ? time : time.split(':').slice(0, 2).join(':')
  }

  const getDate = (date: string): string => {
    return date.split(' ')[0]
  }

  const toUtcDate = (date: string): string => {
    const split = (date || '').split(' ')

    if (split.length !== 2) {
      return date
    }

    return new Date(Date.parse(date)).toISOString().substr(0, 16).replace('T', ' ')
  }

  const getTimeZoneOffset = (date: Date, timeZone: string): number => {
    let iso = date.toLocaleString('en-CA', { timeZone, hour12: false }).replace(', ', 'T')
    iso += '.' + date.getMilliseconds()
    const lieUTC = `${iso.padStart(3, '0')}Z`

    const lie: Date = new Date(Date.parse(lieUTC))
    return -(lie.getTime() - date.getTime())
  }

  const shiftTime = (time: string, ms: number): string => {
    const [hours, minutes]: string[] = time.split(':')
    const date = new Date()
    date.setHours(+hours)
    date.setMinutes(+minutes)
    const diff = date.getTime() - ms
    const shiftedDate = new Date(diff)
    return `${shiftedDate.getHours().toString().padStart(2, '0')}:${shiftedDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const shiftBlackoutHours = (items: string[], ms: number): string[] => {
    return items.map((time) => {
      const [from, to] = time.split('-')
      const timeFrom = shiftTime(from, ms)
      const timeTo = shiftTime(to, ms)
      return `${timeFrom}-${timeTo}`
    })
  }

  return {
    formatDate,
    getTime,
    getDate,
    toUtcDate,
    getTimeZoneOffset,
    shiftTime,
    shiftBlackoutHours
  }
}

export interface UseDate {
  formatDate: (value: string) => string
  getTime: (date: string) => string
  getDate: (date: string) => string
  toUtcDate: (date: string) => string
  getTimeZoneOffset: (date: Date, timeZone: string) => number
  shiftTime: (time: string, ms: number) => string
  shiftBlackoutHours: (items: string[], ms: number) => string[]
}
