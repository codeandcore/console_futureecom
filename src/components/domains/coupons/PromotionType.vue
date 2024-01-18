<template>
  <v-select
    v-bind="$attrs"
    v-model="type"
    :label="$t('Discount type')"
    outlined
    :items="discountTypes"
    item-text="name"
    item-value="code"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion, PromotionType } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

type SelectDiscountType = { name: TranslateResult; code: PromotionType }

export default defineComponent({
  name: 'PromotionType',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const type = computed({
      get: () => props.value.type,
      set: (type) => {
        const isCatalogType = type === 'catalog'
        const data = {
          type,
          code: isCatalogType ? undefined : props.value.code,
          max_customer_uses: isCatalogType ? undefined : props.value.max_customer_uses,
          max_total_uses: isCatalogType ? undefined : props.value.max_total_uses
        }
        emit('input', { ...props.value, ...data })
      }
    })

    const discountTypes = computed((): SelectDiscountType[] => [
      { name: root.$t('Catalog'), code: 'catalog' },
      { name: root.$t('Coupon'), code: 'coupon' }
    ])

    return {
      type,
      discountTypes
    }
  }
})
</script>
