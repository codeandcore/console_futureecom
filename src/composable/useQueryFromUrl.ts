import { computed } from '@vue/composition-api'
import { useRoute } from '@/composable/migrateUseRoute'
import { useRouter } from '@intlify/vue-router-bridge'
import type { WritableComputedRef } from '@vue/composition-api'

export const useQueryFromUrl = <T>(defaultQuery: T): WritableComputedRef<T> => {
  const router = useRouter()
  const route = useRoute()

  return computed<T>({
    get: () => (Object.keys(route.query).length === 0 ? defaultQuery : (route.query as T)),
    set: (query: any) => router.push({ query }).catch(Boolean)
  })
}
