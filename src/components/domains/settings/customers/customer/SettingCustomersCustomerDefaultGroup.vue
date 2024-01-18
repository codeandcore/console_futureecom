<template>
  <settings-customer-default-group v-model="defaultGroup" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SettingsCustomerDefaultGroup from '@/components/domains/settings/customers/SettingsCustomerDefaultGroup.vue'
import type { CustomersSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingCustomersCustomerDefaultGroup',

  components: { SettingsCustomerDefaultGroup },

  props: {
    value: {
      type: Object as PropType<CustomersSettings['customer']>,
      required: true
    }
  },

  setup(props, { emit }) {
    const defaultGroup = computed({
      get: () => props.value.default_group,
      set: (default_group) => emit('input', { ...props.value, default_group })
    })

    return {
      defaultGroup
    }
  }
})
</script>
