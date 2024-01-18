import { ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { ResponseCollection } from '@futureecom/futureecom-js'
import type { Term } from '@futureecom/futureecom-js/dist/services/auth-service'

const tos = ref<Term>()

export const useTosGate = () => {
  const api = useApi()

  const fetchTos = () =>
    api.auth
      .terms({
        filter: { type: 'admin' },
        sort: ['-version']
      })
      .then((val: ResponseCollection<Term>) => (tos.value = val.data[0]))

  return {
    fetchTos,
    currentTos: tos
  }
}
