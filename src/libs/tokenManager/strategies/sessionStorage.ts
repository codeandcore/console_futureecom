import type { TokenDriver } from '@/types/TokenDriver'

export const sessionStorageStrategy: TokenDriver = {
  get: (tokenName) => sessionStorage.getItem(tokenName) || undefined,
  set: (tokenName, value) => (value ? sessionStorage.setItem(tokenName, value) : sessionStorage.removeItem(tokenName))
}
