<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PaymentMethodResponse } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PaymentMethodActionDelete',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<PaymentMethodResponse>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    'update:loading': (_: boolean) => true,
    'success': () => true,
    'error': (_: unknown) => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.payments
        .deleteMethod(props.value.id)
        .then(() => {
          addSuccessToast(t('Deleted payment method'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete payment method'))
          const { status, data } = err.response || {}
          if (status === HTTPResponseCode.NOT_FOUND) {
            addErrorToast(t('Resource not found'))
          } else if (data.message) {
            addErrorToast(data.message)
          }
          emit('error', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      deleteHandler
    }
  }
})
</script>
