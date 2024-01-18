import { castToVueI18n, createI18n } from 'vue-i18n-bridge'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n, { bridge: true })

export const i18n = castToVueI18n(
  createI18n(
    {
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      missingWarn: false,
      fallbackRoot: true
    },
    VueI18n
  )
)

Vue.use(i18n)
