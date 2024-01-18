<template>
  <select-vat :value="value.vat" hide-details="auto" @input="onVatChange" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { recalculateGross, recalculateNet } from '@/libs/vatRecalcuations'
import { useTaxes } from '@/composable/useTaxes'
import SelectVat from '@/components/common/selectables/SelectVat.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductVat',

  components: { SelectVat },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { netDisabled, grossDisabled } = useTaxes()

    const onVatChange = (vat: BaseVat) => {
      if (!netDisabled.value) {
        emitUpdatedGross(vat)
      }

      if (!grossDisabled.value) {
        emitUpdatedNet(vat)
      }
    }

    const emitUpdatedGross = (vat: BaseVat) => {
      const getNoVat = () => ({
        gross_price: props.value.price,
        gross_sale_price: props.value.sale_price
      })

      const getUpdatedGross = () => {
        const { price, sale_price } = props.value
        return {
          gross_price: price ? recalculateGross(price, vat) : price,
          gross_sale_price: sale_price ? recalculateGross(sale_price, vat) : sale_price
        }
      }

      const updatedPrices = vat ? getUpdatedGross() : getNoVat()

      const tiers = (props.value.tiers || []).map((item) => ({
        ...item,
        gross_price: vat && item.price ? recalculateGross(item.price, vat) : item.price
      }))

      emit('input', { ...props.value, ...updatedPrices, vat, tiers })
    }

    const emitUpdatedNet = (vat: BaseVat) => {
      const getNoVat = () => ({
        gross_price: props.value.price,
        gross_sale_price: props.value.sale_price
      })

      const getUpdatedNet = () => {
        const { gross_price, gross_sale_price } = props.value
        return {
          price: gross_price ? recalculateNet(gross_price, vat) : gross_price,
          sale_price: gross_sale_price ? recalculateNet(gross_sale_price, vat) : gross_sale_price
        }
      }

      const updatedPrices = vat ? getUpdatedNet() : getNoVat()

      const tiers = (props.value.tiers || []).map((item) => ({
        ...item,
        price: vat && item.gross_price ? recalculateNet(item.gross_price, vat) : item.gross_price
      }))

      emit('input', { ...props.value, ...updatedPrices, vat, tiers })
    }

    return {
      onVatChange
    }
  }
})
</script>
