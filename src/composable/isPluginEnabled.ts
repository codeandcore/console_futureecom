import { computed } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'

export default (plugin: string) => computed(() => useSettings().getSettings(`general.${plugin}.enabled`).value || false)
