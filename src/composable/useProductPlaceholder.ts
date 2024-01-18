import { computed, ref } from '@vue/composition-api'
import { useStores } from '@/composable/repositories/useStores'
import useApi from '@/composable/useApi'

export const defaultProductPlaceholder = require('@/assets/product_placeholder.png')
export const cmsProductImagePlaceholder = ref('')

export const useProductPlaceholder = (image?: string) => {
  const fetchCmsProductPlaceholder = (): Promise<void> => {
    cmsProductImagePlaceholder.value = ''

    return useApi()
      .cms.settings(useStores().currentStore.value?.template || 'default', { perPage: -1 })
      .then((value) => {
        const item = value.data.find((item) => item.code === 'layout.placeholder.product')?.value
        cmsProductImagePlaceholder.value = typeof item === 'string' ? item : ''
      })
      .catch()
  }

  const placeholderIndex = ref(0)
  const placeholders = computed(() => {
    return [image, cmsProductImagePlaceholder.value, defaultProductPlaceholder].filter(Boolean)
  })

  const nextPlaceholder = () => (placeholderIndex.value += 1)

  return {
    placeholders,
    currentPlaceholder: computed(() => placeholders.value[placeholderIndex.value]),
    nextPlaceholder,
    fetchCmsProductPlaceholder
  }
}
