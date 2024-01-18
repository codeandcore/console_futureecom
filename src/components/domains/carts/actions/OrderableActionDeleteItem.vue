<template>
  <delete-button v-bind="{ ...$attrs, loading, suppressConfirmation }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { emitOrderableError } from '@/views/cart/communication/OrderableEventBus'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Orderable } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderableActionDeleteItem',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
    suppressConfirmation: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast } = useToasts()

    const api = useApi()

    const loading = ref(false)

    const emitLoadingState = (val: boolean) => {
      loading.value = val
      emit('update:isLoading', loading.value)
    }

    const deleteHandler = (): void => {
      emitLoadingState(true)
      api.carts
        .deleteItemInOrderable(props.value, props.itemId)
        .then((val) => {
          emit('input', val)
          addSuccessToast(t('Item successfully deleted'))
        })
        .catch((err) => emitOrderableError(err, 'Unable to delete item'))
        .finally(() => emitLoadingState(false))
    }

    return {
      deleteHandler,
      loading
    }
  }
})
</script>
