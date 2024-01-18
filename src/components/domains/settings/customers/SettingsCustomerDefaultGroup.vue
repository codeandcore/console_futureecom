<template>
  <div v-if="canReadCustomerGroups" class="d-flex flex-gap-16 flex-column">
    <v-select
      v-bind="$attrs"
      v-model="defaultGroup"
      outlined
      :items="customerGroups"
      item-text="name"
      item-value="code"
      :loading="loading"
      :label="$t('Default group')"
    />
  </div>
  <readonly-card v-else>
    <div class="d-flex flex-gap-8 align-center">
      <span>{{ $t('Default group') }}:</span>
      <span>{{ value }}</span>
    </div>
  </readonly-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'SettingsCustomerDefaultGroup',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const loading = ref(false)
    const canReadCustomerGroups = computed(() => root.$can('read,customers\\group', 'manage,customers\\group').value)
    const customerGroups = ref<CustomersGroups[]>([])

    if (canReadCustomerGroups.value) {
      loading.value = true
      useApi()
        .customers.groups({ perPage: -1 })
        .then((val) => (customerGroups.value = val.data))
        .finally(() => (loading.value = false))
    }

    const defaultGroup = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      canReadCustomerGroups,
      defaultGroup,
      customerGroups,
      loading
    }
  }
})
</script>
