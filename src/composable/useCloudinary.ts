import { computed, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import type { CloudinarySettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export const useCloudinary = () => {
  const { getSettings } = useSettings()

  const cloudinarySettings = getSettings<CloudinarySettings>('general.cloudinary')
  const loading = ref(false)

  const isUploadable = computed(() => Boolean(cloudinarySettings.value?.name && cloudinarySettings.value?.preset))

  const uploadImage = async (file: File | string): Promise<string> => {
    if (typeof file === 'string') {
      return Promise.resolve(file)
    }

    if (!isUploadable.value) {
      return Promise.reject('Set up cloudinary first')
    }

    const { name, preset } = cloudinarySettings.value

    const url = `https://api.cloudinary.com/v1_1/${name || ''}/upload`

    loading.value = true

    const fd = new FormData()
    fd.append('upload_preset', preset || '')
    fd.append('file', file)

    try {
      const response = await fetch(url, { method: 'POST', body: fd })
      const json = await response.json()
      return Promise.resolve(json.secure_url)
    } catch (e) {
      return Promise.reject(e)
    } finally {
      loading.value = false
    }
  }

  return {
    isUploadable,
    uploadImage,
    loading
  }
}
