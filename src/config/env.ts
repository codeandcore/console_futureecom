export const TOKEN = {
  STRATEGY: process.env.VUE_APP_TOKEN_STRATEGY,
  ACCESS_TOKEN_KEY: process.env.VUE_APP_ACCESS_TOKEN_COOKIE_KEY || 'access_token',
  REFRESH_TOKEN_KEY: process.env.VUE_APP_REFRESH_TOKEN_COOKIE_KEY || 'refresh_token',
  REFRESH_TENANCY_KEY: process.env.VUE_APP_REFRESH_TENANCY_KEY || 'refresh_tenancy',
  CHECK_ACCESS_TOKEN_EVERY_SECONDS: Number(process.env.VUE_APP_CHECK_ACCESS_TOKEN_EVERY_SECONDS) || 6000
}

export const API = {
  URL: process.env.VUE_APP_API_BASEURL || '',
  CLIENT_ID: process.env.VUE_APP_CLIENT_ID || '',

  ORGANISATION_ID: process.env.VUE_APP_ORGANISATION_ID ? Number(process.env.VUE_APP_ORGANISATION_ID) : undefined,
  STORE_ID: process.env.VUE_APP_STORE_ID ? Number(process.env.VUE_APP_STORE_ID) : undefined,
  WS_URL: process.env.VUE_APP_WS_URL || ''
}

export const APP = {
  TYPE: process.env.VUE_APP_APPLICATION_TYPE
}
