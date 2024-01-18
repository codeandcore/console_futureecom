import { API, TOKEN } from '@/config/env'
import { api, refreshTenancyKeys, refreshToken, refreshTokenRef, tokenRef } from '@/libs/api'
import { tokenDriver } from '@/libs/tokenManager/driver'
import { transformQuery } from '@/libs/transformQuery'
import FutureEcom from '@futureecom/futureecom-js/dist/futureecom'
import axios from 'axios'
import isAxiosError from '@/libs/isAxiosError'
import qs from 'qs'
import type { AxiosPromise, AxiosResponse } from 'axios'

export const tokenDriverInstance = tokenDriver()

export const getApiConfig = (clientId?: string, organisation?: number): FutureEcom => {
  return new FutureEcom({
    apiUrl: API.URL,

    storeId: API.STORE_ID,
    organisationId: organisation || API.ORGANISATION_ID,
    clientId: clientId || API.CLIENT_ID,
    ws: API.WS_URL ? { url: API.WS_URL, client: WebSocket } : undefined,

    get accessToken() {
      return tokenRef.value
    },

    set accessToken(value) {
      tokenRef.value = value
      tokenDriverInstance.set(TOKEN.ACCESS_TOKEN_KEY, value)
    },

    get refreshToken() {
      return refreshToken.value
    },

    set refreshToken(value) {
      refreshTokenRef.value = value
      tokenDriverInstance.set(TOKEN.REFRESH_TOKEN_KEY, value)
    },

    interceptors: {
      response: async (response: AxiosResponse): Promise<AxiosPromise> => {
        if (!isAxiosError(response) || !response.response || ![401, 417].includes(response.response.status)) {
          return Promise.reject(response)
        }

        api.config.accessToken = undefined

        if (!api.config.refreshToken) {
          return Promise.reject(response)
        }

        const { organisation, store: id } = refreshTenancyKeys.value

        const request = id != null ? api.usingStore({ organisation, id }) : api.usingOrganisation(organisation)

        return request.auth
          .refreshAccessToken(api.config.refreshToken)
          .then((value) => {
            response.config.headers.Authorization = `${value.token_type} ${value.access_token}`
            return axios(response.config)
          })
          .catch(() => {
            api.config.refreshToken = undefined
            return Promise.reject(response)
          })
      }
    },

    paramsSerializer: (params?: any): string => {
      const filter = (prefix: string, value: unknown) => {
        return transformQuery(value, { returnSource: true, emptyArrayString: true, nullString: true })
      }

      return qs.stringify(params, { arrayFormat: 'comma', encode: false, filter })
    }
  })
}
