<template>
  <select-vat :value="value" hide-details="auto" @input="onVatChange" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { recalculateGross, recalculateNet } from '@/libs/vatRecalcuations'
import { useTaxes } from '@/composable/useTaxes'
import SelectVat from '@/components/common/selectables/SelectVat.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Money } from '@futureecom/futureecom-js'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ApplicableVat',

  components: { SelectVat },

  props: {
    value: {
      type: Object as PropType<BaseVat>,
      default: null
    },
    price: {
      type: Object as PropType<Money | null>,
      default: null
    },
    grossPrice: {
      type: Object as PropType<Money | null>,
      default: null
    }
  },

  emits: {
    'input': (_: BaseVat) => true,
    'update:prices': (_: { price: Money | null; gross_price: Money | null }) => true,
    'recalculate:gross': () => true,
    'recalculate:net': () => true
  },

  setup(props, { emit }) {
    const { netDisabled, grossDisabled } = useTaxes()

    const onVatChange = (vat: BaseVat) => {
      emit('input', vat)

      if (!netDisabled.value) {
        emit('recalculate:gross')
        emit('update:prices', {
          price: props.price,
          gross_price: props.price && vat ? recalculateGross(props.price, vat) : props.price
        })
      }

      if (!grossDisabled.value) {
        emit('recalculate:net')
        emit('update:prices', {
          price: props.grossPrice && vat ? recalculateNet(props.grossPrice, vat) : props.grossPrice,
          gross_price: props.grossPrice
        })
      }
    }

    return {
      onVatChange
    }
  }
})
</script>
