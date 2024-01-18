<template>
  <div>
    <div class="d-flex flex-column text-wrap">
      <span class="text-capitalize">
        {{ value.subset.rule }}
      </span>
      <div class="d-flex flex-column text-caption grey--text mt-2">
        <span v-if="value.maximum_applicable_items">{{ $t('Max items') }}: {{ value.maximum_applicable_items }}</span>
        <span v-if="value.maximum_applicable_times">{{ $t('Max times') }}: {{ value.maximum_applicable_times }}</span>
        <span>
          {{ value.included ? 'Included in discount' : 'Excluded from discount' }}:
          {{ (value.subset.value || []).join(', ') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PromotionTargetCondition } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionTargetConditionPreview',

  props: {
    value: {
      type: Object as PropType<PromotionTargetCondition>,
      required: true
    }
  }
})
</script>
