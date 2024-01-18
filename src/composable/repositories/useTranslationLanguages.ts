import { computed, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

const translationLanguagesList = ref<Language[]>([])

export const useTranslationLanguages = () => {
  const loading = ref(false)

  const fetchTranslationLanguages = async () => {
    loading.value = true
    await useApi()
      .settings.languages()
      .then((value) => (translationLanguagesList.value = value))
      .catch((err) => console.error(err?.response?.data.message))
      .finally(() => (loading.value = false))
  }

  const addLanguage = (item: Language): void => {
    translationLanguagesList.value = [...translationLanguagesList.value, { ...item }]
  }

  const updateLanguage = (item: Language): void => {
    translationLanguagesList.value = translationLanguagesList.value.map((lang: Language) =>
      lang.code === item.code ? item : lang
    )
  }

  const deleteLanguage = (item: Language): void => {
    translationLanguagesList.value = translationLanguagesList.value.filter((lang) => lang.code !== item.code)
  }

  return {
    loading,
    translationLanguages: computed(() => translationLanguagesList.value),
    fetchTranslationLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage
  }
}
