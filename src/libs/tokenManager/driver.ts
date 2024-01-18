import { TOKEN } from '@/config/env'
import { cookieStrategy } from '@/libs/tokenManager/strategies/cookie'
import { localStorageStrategy } from '@/libs/tokenManager/strategies/localStorage'
import { sessionStorageStrategy } from '@/libs/tokenManager/strategies/sessionStorage'
import type { Token } from '@futureecom/futureecom-js'
import type { TokenDriver } from '@/types/TokenDriver'

const tokenStrategy: Record<string, TokenDriver> = {
  session: sessionStorageStrategy,
  localStorage: localStorageStrategy,
  cookie: cookieStrategy
}

const driver = TOKEN.STRATEGY ? tokenStrategy[TOKEN.STRATEGY] : undefined

export const tokenDriver = () => {
  const get = (tokenType: string): Token => {
    return driver?.get(tokenType)
  }

  const set = (tokenType: string, token: Token): void => {
    driver?.set(tokenType, token)
  }

  return { get, set }
}
