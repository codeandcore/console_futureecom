<template>
  <v-select
    v-bind="$attrs"
    v-model="target"
    :items="targets"
    :item-text="(item) => item.name"
    item-value="code"
    :label="$t('Discount Target')"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Promotion, PromotionTarget } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

type SelectTargets = { name: TranslateResult; code: PromotionTarget }

export default defineComponent({
  name: 'PromotionTarget',

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const target = computed({
      get: () => props.value.target,
      set: (target) => emit('input', { ...props.value, target })
    })

    const targets = computed((): SelectTargets[] => [
      { name: root.$t('Items'), code: 'items' },
      { name: root.$t('Shipping'), code: 'shipping' }
    ])

    return {
      target,
      targets
    }
  }
})
</script>
