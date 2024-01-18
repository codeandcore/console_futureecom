import type { TokenDriver } from '@/types/TokenDriver'

export const localStorageStrategy: TokenDriver = {
  get: (tokenName) => localStorage.getItem(tokenName) || undefined,
  set: (tokenName, value) => (value ? localStorage.setItem(tokenName, value) : localStorage.removeItem(tokenName))
}
