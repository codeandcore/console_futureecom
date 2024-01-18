<template>
  <v-text-field v-bind="$attrs" v-model="versionNumber" :label="$t('Version Number')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PaymentHeartland } from '@/types/plugins/HeartlandPayment'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'HeartlandVersionNumber',

  props: {
    value: {
      type: Object as PropType<PaymentHeartland>,
      required: true
    }
  },

  setup(props, { emit }) {
    const versionNumber = computed({
      get: () => props.value.versionNumber,
      set: (versionNumber) => emit('input', { ...props.value, versionNumber })
    })

    return {
      versionNumber
    }
  }
})
</script>
