import type { Money } from './types'

const CURRENCY_SYMBOLS: Record<string, string> = { GBP: '£', USD: '$', EUR: '€' }
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseDurationToMinutes(iso: string): number {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(iso)
  if (!m) return 0
  const days = Number(m[1] ?? 0)
  const hours = Number(m[2] ?? 0)
  const mins = Number(m[3] ?? 0)
  return days * 1440 + hours * 60 + mins
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatTime(iso: string): string {
  return iso.slice(11, 16)
}

export function formatPrice(money: Money): string {
  const value = money.amount.toFixed(2)
  const symbol = CURRENCY_SYMBOLS[money.currency]
  return symbol ? `${symbol}${value}` : `${money.currency} ${value}`
}

export function formatDayLabel(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
}
