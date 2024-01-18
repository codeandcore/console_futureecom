<template>
  <mass-action-dial v-if="dense" :count="items.length" offset-y top nudge-top="10">
    <commission-action-mass-approve v-bind="actionAttrs" v-on="actionOn" />
    <commission-action-mass-unapprove v-bind="actionAttrs" v-on="actionOn" />
    <commission-action-mass-recalculate v-bind="actionAttrs" v-on="actionOn" />
  </mass-action-dial>
  <div v-else class="d-flex flex-gap-8 flex-wrap">
    <commission-action-mass-approve v-bind="actionAttrs" show-amount v-on="actionOn" />
    <commission-action-mass-unapprove v-bind="actionAttrs" show-amount v-on="actionOn" />
    <commission-action-mass-recalculate v-bind="actionAttrs" show-amount v-on="actionOn" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CommissionActionMassApprove from '@/components/domains/commission/actions/CommissionActionMassApprove.vue'
import CommissionActionMassRecalculate from '@/components/domains/commission/actions/CommissionActionMassRecalculate.vue'
import CommissionActionMassUnapprove from '@/components/domains/commission/actions/CommissionActionMassUnapprove.vue'
import MassActionDial from '@/components/tables/MassActionDial.vue'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionMassActions',
  components: {
    MassActionDial,
    CommissionActionMassApprove,
    CommissionActionMassRecalculate,
    CommissionActionMassUnapprove
  },

  props: {
    items: {
      type: Array as PropType<Commission[]>,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const onSuccess = () => emit('onSuccess')
    const onUpdateLoading = (value: boolean) => emit('update:loading', value)

    const actionOn = computed(() => ({ 'onSuccess': onSuccess, 'update:loading': onUpdateLoading }))
    const actionAttrs = computed(() => ({ items: props.items, disabled: props.disabled }))

    return {
      actionOn,
      actionAttrs
    }
  }
})
</script>
