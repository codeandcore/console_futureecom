<template>
  <form-validator-wrapper @submit="emitTier">
    <template #default="{ valid }">
      <v-card-text>
        <div class="d-flex flex-column my-4 flex-gap-32">
          <product-tier-inputs v-model="tier" class="d-flex flex-column flex-gap-16" :rules="rules" :vat="vat" />
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex justify-end pa-4">
        <v-btn :disabled="!valid" depressed color="primary" type="submit">
          {{ $t('Save tier') }}
        </v-btn>
      </v-card-actions>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { recalculateGross, recalculateNet } from '@/libs/vatRecalcuations'
import { useTaxes } from '@/composable/useTaxes'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ProductTierInputs from '@/components/domains/products/tiers/ProductTierPriceInput.vue'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { ProductTier } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductTierRules } from '@/types/catalog/product'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductTierForm',

  components: { ProductTierInputs, FormValidatorWrapper },

  props: {
    value: {
      type: Object as PropType<ProductTier>,
      default: () => ({
        gross_price: null,
        quantity: 1,
        customer_groups: null
      })
    },
    vat: {
      type: Object as PropType<BaseVat | null>,
      default: null
    },
    rules: {
      type: Object as PropType<ProductTierRules>,
      required: true
    }
  },

  setup(props, { emit }) {
    const tier = ref<ProductTier>(structuredClone(props.value))
    const emitTier = (): void => emit('save', { ...props.value, ...tier.value })

    const { netDisabled, grossDisabled } = useTaxes()

    const onVatChange = (vat: BaseVat | null) => {
      if (!netDisabled.value) {
        tier.value = {
          ...tier.value,
          gross_price: tier.value.price && vat ? recalculateGross(tier.value.price, vat) : tier.value.price
        }
      }

      if (!grossDisabled.value) {
        tier.value = {
          ...tier.value,
          price: tier.value.gross_price && vat ? recalculateNet(tier.value.gross_price, vat) : tier.value.price
        }
      }
    }

    watch(() => props.vat, onVatChange)

    return {
      tier,
      emitTier
    }
  }
})
</script>
