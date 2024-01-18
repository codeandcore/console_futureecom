<template>
  <select-vat v-bind="$attrs" v-model="vat" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SelectVat from '@/components/common/selectables/SelectVat.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodVat',

  components: { SelectVat },

  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    }
  },

  setup(props, { emit }) {
    const vat = computed({
      get: () => props.value.vat,
      set: (val: BaseVat | null | undefined) => {
        const vat = val ? { id: val.id, name: val.name, value: val.value } : null
        emit('input', { ...props.value, vat })
      }
    })

    return {
      vat
    }
  }
})
</script>
