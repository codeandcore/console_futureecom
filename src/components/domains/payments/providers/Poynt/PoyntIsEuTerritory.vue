<template>
  <switch-field v-bind="$attrs" v-model="isEuTerritory" :label="$t('Is EU Territory')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PaymentPoynt } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PoyntIsEuTerritory',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<PaymentPoynt>,
      required: true
    }
  },

  setup(props, { emit }) {
    const isEuTerritory = computed({
      get: () => props.value.is_eu_territory,
      set: (is_eu_territory) => emit('input', { ...props.value, is_eu_territory })
    })

    return {
      isEuTerritory
    }
  }
})
</script>
