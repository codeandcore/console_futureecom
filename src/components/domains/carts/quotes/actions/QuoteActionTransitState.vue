<template>
  <v-btn v-bind="$attrs" small color="primary" depressed @click="transitQuoteState">
    {{ $t(action) }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Quote, QuoteTransitionName } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'QuoteActionTransitState',

  props: {
    value: {
      type: Object as PropType<Quote>,
      required: true
    },
    action: {
      type: [] as PropType<Exclude<QuoteTransitionName, 'place'>>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const transitQuoteState = async () => {
      emit('update:loading', true)

      api.carts
        .transitQuote(props.value.id, props.action)
        .finally(() => emit('update:loading', false))
        .then((value) => {
          root.$toast.addSuccessToast(root.$t('Updated quote status'))
          emit('input', value)
        })
        .catch((err) => emitOrderableError(err, 'Unable to transit quote state'))
    }

    return {
      transitQuoteState
    }
  }
})
</script>
