<template>
  <div>
    <div class="d-flex align-center justify-space-between ma-6 flex-gap-8 flex-wrap">
      <span>{{ $t('Status') }}</span>
      <span class="d-flex flex-gap-8">
        <template v-if="quote.status_before && quote.status !== quote.status_before">
          <quote-status-chip :value="quote.status_before" />
          <rtl-chevron-icon />
        </template>
        <quote-status-chip :value="quote.status" />
      </span>
    </div>
    <v-divider />

    <template v-if="availableTransitions.length">
      <div class="d-flex justify-end mx-6 py-4">
        <quote-action-transit-state
          v-for="transition in availableTransitions"
          :key="transition"
          v-model="quote"
          :action="transition"
          :loading.sync="loading"
          :disabled="loading"
        />
      </div>
      <v-divider />
    </template>
    <div class="px-6 py-4">
      <orderable-action-discount-update v-model="quote" :disabled="readonly" />
    </div>
    <v-divider />

    <div class="px-6 py-4">
      <orderable-action-disable-taxes v-model="quote" :readonly="readonly" />
    </div>
  </div>
</template>

<script lang="ts">
import { QuoteTransitionName } from '@futureecom/futureecom-js/dist/services/cart-service'
import { UserType } from '@futureecom/futureecom-js/dist/services/auth-service'
import { accessToken } from '@/libs/api'
import { canMakeTransition } from '@futureecom/futureecom-js/dist/helpers/quote/quote-helpers'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { getUserType } from '@futureecom/futureecom-js/dist/helpers/auth/auth-helpers'
import { hasAddress } from '@/libs/domains/carts/orderableHelpers'
import OrderableActionDisableTaxes from '@/components/domains/carts/actions/OrderableActionDisableTaxes.vue'
import OrderableActionDiscountUpdate from '@/components/domains/carts/actions/OrderableActionDiscountUpdate.vue'
import QuoteActionTransitState from '@/components/domains/carts/quotes/actions/QuoteActionTransitState.vue'
import QuoteStatusChip from '@/components/domains/carts/quotes/QuoteStatusChip.vue'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import type { PropType } from '@vue/composition-api'
import type { Quote } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'QuoteStatusActions',

  components: {
    QuoteStatusChip,
    OrderableActionDisableTaxes,
    OrderableActionDiscountUpdate,
    QuoteActionTransitState,
    RtlChevronIcon
  },

  props: {
    value: {
      type: Object as PropType<Quote>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const loading = ref(false)

    const quote = computed({
      get: (): Quote => props.value,
      set: (value) => emit('input', value)
    })

    const availableTransitions = computed((): Exclude<QuoteTransitionName, 'place'>[] => {
      const transitions: { name: Exclude<QuoteTransitionName, 'place'>; can: boolean }[] = [
        { name: QuoteTransitionName.PROCESS, can: canTransit(QuoteTransitionName.PROCESS).value },
        { name: QuoteTransitionName.REVERT, can: canTransit(QuoteTransitionName.REVERT).value },
        { name: QuoteTransitionName.RECOVER, can: canTransit(QuoteTransitionName.RECOVER).value },
        { name: QuoteTransitionName.FULFILL, can: canFulfill.value && canTransit(QuoteTransitionName.FULFILL).value }
      ]

      return transitions.filter((item) => item.can).map((item) => item.name)
    })

    const userTypes: UserType[] = [UserType.ADMIN, UserType.SUPER_ADMIN]
    const isValidUserType = (val: any): val is UserType => userTypes.includes(val || '')

    const userType = computed(() => getUserType(accessToken.value))

    const canFulfill = computed(() => {
      if (!(props.value.items || []).length || !props.value.customer || !props.value.shipping) {
        return false
      }

      return hasAddress(props.value, 'shipping_address') && hasAddress(props.value, 'billing_address')
    })

    const canTransit = (action: QuoteTransitionName) => {
      return computed(() => isValidUserType(userType.value) && canMakeTransition(props.value, action, userType.value))
    }

    return {
      loading,
      quote,
      availableTransitions
    }
  }
})
</script>
