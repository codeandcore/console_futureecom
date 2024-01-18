<template>
  <switch-field
    v-bind="$attrs"
    v-model="included"
    :label="included ? $t('Included In Discount') : $t('Excluded From Discount')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionTargetConditionIncluded',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  },

  setup(props, { emit }) {
    const included = computed({
      get: () => props.value.included,
      set: (included) => emit('input', { ...props.value, included })
    })

    return {
      included
    }
  }
})
</script>
