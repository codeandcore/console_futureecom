import { app } from '@/app'
import { computed, ref } from '@vue/composition-api'
import languages from '@/config/languages'
import type { ConsoleLanguage } from '@/types/ConsoleLanguage'
import type { LocaleMessageObject } from 'vue-i18n'

const currentLanguage = ref<ConsoleLanguage>()

export const useAppLanguages = () => {
  const initLanguage = (): void => {
    const localLanguage = localStorage.getItem('language') || 'en'
    const lang: ConsoleLanguage | undefined = languages.find(
      (item: ConsoleLanguage): boolean => item.code === localLanguage
    )

    setLanguage(lang)
  }

  const setLanguage = async (lang?: ConsoleLanguage): Promise<void> => {
    if (!lang) {
      return
    }

    const messages = await fetchLanguageMessages(lang.file)
    app.$i18n.setLocaleMessage(lang.code, messages)

    app.$i18n.locale = lang.code
    app.$vuetify.rtl = lang.rtl

    localStorage.setItem('language', lang.code)
    currentLanguage.value = lang
  }

  const fetchLanguageMessages = (filename: string): LocaleMessageObject => {
    const messages = require(`@/lang/${filename}`)
    return messages.default || messages
  }

  return {
    currentLanguage: computed((): ConsoleLanguage | undefined => currentLanguage?.value),
    languages: computed((): ConsoleLanguage[] => languages),
    initLanguage,
    setLanguage
  }
}
