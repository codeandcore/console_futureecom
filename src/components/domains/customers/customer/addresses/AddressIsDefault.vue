<template>
  <switch-field v-bind="$attrs" v-model="is_default" :label="$t('Default')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressIsDefault',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  },
  setup(props, { emit }) {
    const is_default = computed({
      get: () => props.value.is_default,
      set: (is_default) => emit('input', { ...props.value, is_default })
    })

    return {
      is_default
    }
  }
})
</script>
