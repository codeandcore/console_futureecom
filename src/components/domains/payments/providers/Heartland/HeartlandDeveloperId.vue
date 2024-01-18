<template>
  <v-text-field v-bind="$attrs" v-model="developerId" :label="$t('Developer ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentHeartland } from '@/types/plugins/HeartlandPayment'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'HeartlandDeveloperId',

  props: {
    value: {
      type: Object as PropType<PaymentHeartland>,
      required: true
    }
  },

  setup(props, { emit }) {
    const developerId = computed({
      get: () => props.value.developerId,
      set: (developerId) => emit('input', { ...props.value, developerId })
    })

    return {
      developerId
    }
  }
})
</script>
