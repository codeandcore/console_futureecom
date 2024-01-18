import { computed, ref } from '@vue/composition-api'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'

export const zeroOrganisation: Organisation = {
  id: 0,
  name: 'Overview',
  code: 'overview',
  stores: []
}

export const isOverviewMode = ref(false)

export const setOverviewMode = (val: boolean) => (isOverviewMode.value = val)
export default computed(() => isOverviewMode.value)
