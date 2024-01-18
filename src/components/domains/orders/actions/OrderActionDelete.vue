<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler">
    <template #dialog-content>
      <span data-cy="order-action-delete-confirmation-content">
        {{ $t('Are you sure you want to delete this order? This action cannot be undone.') }}
      </span>
    </template>
  </delete-button>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionDelete',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    'success': () => true,
    'error': (_val: unknown) => true,
    'update:loading': (_: boolean) => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)
    const api = useApi()

    const emitLoadingState = () => emit('update:loading', loading.value)
    const deleteHandler = async (): Promise<void> => {
      loading.value = true
      emitLoadingState()

      api.orders
        .deleteOrder(props.value.id)
        .then(() => {
          emit('success')
          addSuccessToast(t('Deleted order'))
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete order'))
          if (err.response?.data.message) {
            addErrorToast(err.response?.data.message)
          }
          emit('error', err.response?.data)
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
