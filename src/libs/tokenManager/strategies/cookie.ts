import cookies from 'browser-cookies'
import type { TokenDriver } from '@/types/TokenDriver'

export const cookieStrategy: TokenDriver = {
  get: (tokenName) => cookies.get(tokenName) || undefined,
  set: (tokenName, value) => (value ? cookies.set(tokenName, value) : cookies.erase(tokenName))
}
