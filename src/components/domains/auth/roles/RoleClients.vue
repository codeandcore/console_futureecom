<template>
  <select-multiple-clients
    v-bind="$attrs"
    v-model="currentClients"
    :options="{ showChip: true, grid: gridOptions }"
    @input="onSelect"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import SelectMultipleClients from '@/components/common/selectables/SelectMultipleClients.vue'
import useApi from '@/composable/useApi'
import type { Client, Role } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'RoleClients',
  components: { SelectMultipleClients },
  props: {
    value: {
      type: Object as PropType<Role>,
      required: true
    }
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    const api = useApi()
    const currentClients = ref<Client[]>()

    if (props.value.client_ids?.length) {
      api.auth.clients({ filter: { id: props.value.client_ids } }).then((val) => (currentClients.value = val.data))
    }

    const gridOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' },
        { text: t('ID'), value: 'id' }
      ]

      return {
        headers
      }
    })

    const client_ids = computed({
      get: () => props.value.client_ids || [],
      set: (client_ids) => emit('input', { ...props.value, client_ids })
    })

    const onSelect = (val: Client[]) => {
      currentClients.value = val
      client_ids.value = val.map((item) => item.id)
    }

    return {
      currentClients,
      gridOptions,
      onSelect
    }
  }
})
</script>
