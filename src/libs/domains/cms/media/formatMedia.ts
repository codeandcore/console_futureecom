import { isArray, isEmptyArray } from '@/libs/arrays'
import type { CreateMedia, UpdateMedia } from '@futureecom/futureecom-js/dist/services/cms-service'

export const transformMediaToFormData = (media: CreateMedia | UpdateMedia): FormData => {
  const isNew = (val: CreateMedia | UpdateMedia): val is CreateMedia => !('id' in val)

  const fd = new FormData()

  fd.append('name', media.name)

  fd.append('description', media.description || '')

  if (media.image) {
    fd.append('image', media.image)
  }

  if (isNew(media)) {
    fd.append('public_id', media.public_id || '')
  }

  if (isArray(media.tags) && !isEmptyArray(media.tags)) {
    media.tags.forEach((tag) => fd.append('tags[]', tag))
  } else {
    fd.append('tags', '')
  }

  return fd
}
