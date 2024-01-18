import type { Token } from '@futureecom/futureecom-js'

export interface TokenDriver {
  get: (tokenName: string) => Token
  set: (tokenName: string, value: Token) => void
}
