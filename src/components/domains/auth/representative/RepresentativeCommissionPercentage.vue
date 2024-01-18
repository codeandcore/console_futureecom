<template>
  <v-text-field
    v-bind="$attrs"
    v-model.number="commissionPercentage"
    :label="$t('Commission Percentage')"
    type="number"
    outlined
    suffix="%"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type {
  NewRepresentative,
  UpdateRepresentative
} from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'RepresentativeCommissionPercentage',

  props: {
    value: {
      type: Object as PropType<NewRepresentative | UpdateRepresentative>,
      required: true
    }
  },

  setup(props, { emit }) {
    const commissionPercentage = computed({
      get: () => props.value.commission_percentage,
      set: (commission_percentage) => emit('input', { ...props.value, commission_percentage })
    })

    return {
      commissionPercentage
    }
  }
})
</script>
