<template>
  <settings-customer-default-group v-model="defaultGroup" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SettingsCustomerDefaultGroup from './SettingsCustomerDefaultGroup.vue'
import type { CustomersSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SettingCustomersGuest',

  components: { SettingsCustomerDefaultGroup },

  props: {
    value: {
      type: Object as PropType<CustomersSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const defaultGroup = computed({
      get: () => props.value.guest.default_group,
      set: (default_group) => emit('input', { ...props.value, guest: { default_group } })
    })

    return {
      defaultGroup
    }
  }
})
</script>
