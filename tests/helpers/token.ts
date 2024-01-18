import { sign } from 'jsonwebtoken'
import dayjs from 'dayjs'
import futureecom from '@futureecom/futureecom-js'
import type { JwtTokenUserProfile, TokenResponse } from '@futureecom/futureecom-js/dist/services/auth-service'

interface AccessTokenData {
  api: futureecom
  scope: string[]
  time?: number
  profile?: JwtTokenUserProfile
}

export const generateAccessToken = (data: AccessTokenData): string => {
  const { api, time, profile, scope } = data
  const tokenTime = time || Date.now() / 1000

  const payload = {
    exp: tokenTime + 6000,
    iat: tokenTime - 6000,
    id: 'f92f617d-b24a-4fe6-85d7-f246773c1961',
    iss: 'eu-01.futureecom.app',
    nbf: tokenTime - 6000,
    sub: 'a95f3075-d4aa-490b-b899-39913460da0f',
    token_type: 'Bearer',
    user: {
      organisation: api.config.organisationId,
      store: api.config.storeId,
      client_id: api.config.clientId,
      client_name: 'SuperAdmin',
      meta: { application: 'overview' },
      profile,
      scope
    }
  }

  return sign(payload, 'secret')
}

export const generateRefreshToken = (api: futureecom): string => {
  return sign(
    {
      client_id: api.config.clientId,
      expires_at: dayjs().add(1, 'week'),
      key: 'e9c458fd-56e1-4a5e-91d0-7ed5cccd6bb3',
      scope: [],
      user_id: 'a95f3075-d4aa-490b-b899-39913460da0f'
    },
    'secret'
  )
}

export const generateResponse = (api: futureecom, scope: string[] = []): TokenResponse => {
  return {
    access_token: generateAccessToken({ api, scope }),
    expires_in: 3600,
    refresh_token: generateRefreshToken(api),
    token_type: 'Bearer'
  }
}
