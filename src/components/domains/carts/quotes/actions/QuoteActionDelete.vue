<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Quote } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'QuoteActionDelete',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Quote>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = (): void => {
      loading.value = true
      emitLoadingState()

      api.carts
        .deleteQuote(props.value.id)
        .then(() => {
          root.$toast.addSuccessToast('Deleted quote')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast(root.$t('Unable to delete quote'))
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      deleteHandler,
      loading
    }
  }
})
</script>
