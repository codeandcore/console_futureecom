<template>
  <switch-field
    v-bind="$attrs"
    v-model="require_password_change"
    :label="$t('Require password change on first login')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { BaseCustomer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerPasswordRequireChange',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<BaseCustomer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const require_password_change = computed({
      //@ts-expect-error
      get: () => props.value.require_password_change,
      set: (require_password_change) => emit('input', { ...props.value, require_password_change })
    })

    return {
      require_password_change
    }
  }
})
</script>
