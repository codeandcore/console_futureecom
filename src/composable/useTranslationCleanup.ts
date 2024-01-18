import { useEmptyFieldCleanup } from '@/composable/useEmptyFieldCleanup'
import { useSettings } from '@/composable/repositories/useSettings'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

type ObjType = { [p: string]: any }

export const useTranslationCleanup = (): useTranslationCleanup => {
  const { getStoreSetting } = useSettings()
  const { translationLanguages } = useTranslationLanguages()
  const languages = translationLanguages.value || []

  const defaultLanguage = getStoreSetting('general.locale.language')

  const forEachLanguage = (fn: (lang: Language) => any): void => {
    languages.forEach((lang: Language) => {
      if (lang.code !== defaultLanguage) {
        fn(lang)
      }
    })
  }

  return {
    removeEmptyTranslations: useEmptyFieldCleanup,
    forEachLanguage
  }
}

export interface useTranslationCleanup {
  removeEmptyTranslations: (obj?: ObjType | null) => ObjType | undefined
  forEachLanguage: (fn: (lang: Language) => any) => void
}
