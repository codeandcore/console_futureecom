<template>
  <select-currency v-model="currency" :error-messages="errors['currency']" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectCurrency from '@/components/common/selectables/SelectCurrency.vue'
import type { NewStore } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'StoreCurrency',
  components: { SelectCurrency },
  props: {
    value: {
      type: Object as () => NewStore,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const currency = computed({
      get: () => props.value.currency,
      set: (currency) => emit('input', { ...props.value, currency })
    })

    return {
      currency
    }
  }
})
</script>
