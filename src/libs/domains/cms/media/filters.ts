import type { FilterDefinition } from '@/types/FilterDefinitions'
import type { MediaFilter } from '@futureecom/futureecom-js/dist/services/cms-service'

export const mediaFilters: FilterDefinition<MediaFilter>[] = [
  { type: 'text', code: 'name', label: 'Name' },
  { type: 'array', code: 'tags', label: 'Tags' },
  { type: 'text', code: 'secure_url', label: 'Secure URL' },
  { type: 'text', code: 'url', label: 'URL' },
  { type: 'text', code: 'public_id', label: 'Public ID' },
  { type: 'date', code: 'created_at', label: 'Created at' },
  { type: 'date', code: 'updated_at', label: 'Updated at' }
]
