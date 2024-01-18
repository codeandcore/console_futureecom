<template>
  <v-select
    v-bind="$attrs"
    v-model="rate_type"
    :label="$t('Rate type')"
    outlined
    :items="rateTypes"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { Promotion, PromotionRateType } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionRateType',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const isMoneyRate = (rate: PromotionRateType) => ['distributed', 'fixed'].includes(rate)

    const rate_type = computed({
      get: () => props.value.rate_type,
      set: (rate_type) => {
        const isStillMoneyRate = isMoneyRate(rate_type) && isMoneyRate(props.value.rate_type)
        emit('input', { ...props.value, rate_type, value: isStillMoneyRate ? props.value.value : null })
      }
    })

    const rateTypes = computed(() => [
      { text: t('Fixed in total'), value: 'distributed' },
      { text: t('Percentage'), value: 'percentage' },
      { text: t('Fixed per item'), value: 'fixed' }
    ])

    return {
      rate_type,
      rateTypes
    }
  }
})
</script>
