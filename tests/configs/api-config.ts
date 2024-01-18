import { Config, Token } from '@futureecom/futureecom-js'

const tokens: { accessToken: Token; refreshToken: Token } = {
  accessToken: undefined,
  refreshToken: undefined
}

export const apiTestConfig = (options: Partial<Config> = {}): Config => {
  return {
    apiUrl: 'https://localhost:8080',
    clientId: '99000000-0000-0000-0000-000000000000',
    organisationId: 0,

    set accessToken(value) {
      tokens.accessToken = value
    },
    get accessToken(): Token {
      return tokens.accessToken
    },
    set refreshToken(value) {
      tokens.refreshToken = value
    },
    get refreshToken(): Token {
      return tokens.refreshToken
    },
    ...options
  }
}
