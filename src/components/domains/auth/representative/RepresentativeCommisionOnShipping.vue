<template>
  <switch-field
    v-bind="$attrs"
    v-model="commissionOnShipping"
    :label="$t('Commission on shipping')"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type {
  NewRepresentative,
  UpdateRepresentative
} from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'RepresentativeCommissionOnShipping',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<NewRepresentative | UpdateRepresentative>,
      required: true
    }
  },

  setup(props, { emit }) {
    const commissionOnShipping = computed({
      get: () => props.value.commission_on_shipping,
      set: (commission_on_shipping) => emit('input', { ...props.value, commission_on_shipping })
    })

    return {
      commissionOnShipping
    }
  }
})
</script>
