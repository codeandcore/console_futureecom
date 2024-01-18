import type { AxiosError } from 'axios'

export default (error: unknown): error is AxiosError => {
  return !!(error && typeof error === 'object' && 'isAxiosError' in error)
}
