<template>
  <v-dialog v-model="showCancelDialog" max-width="800" scrollable>
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" small text color="error" data-cy="order-action-cancel-btn" v-on="on">
        {{ $t('Cancel') }}
      </v-btn>
    </template>
    <v-card v-if="showCancelDialog">
      <v-card-title class="d-flex justify-space-between">
        <span>{{ $t('Cancel order') }}: {{ value.number }}</span>
      </v-card-title>
      <v-divider />

      <v-card-text class="mt-4">
        <span>{{ $t('Are you sure you want to cancel order?') }}</span>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-space-between ma-2">
        <v-btn depressed color="secondary" text data-cy="order-action-cancel-no-btn" @click="showCancelDialog = false">
          {{ $t('No') }}
        </v-btn>
        <v-btn
          depressed
          color="primary"
          :loading="loading"
          data-cy="order-action-cancel-yes-btn"
          @click="cancelHandler"
        >
          {{ $t('Yes') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionCancel',
  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const loading = ref(false)
    const api = useApi()

    const showCancelDialog = ref(false)

    const cancelHandler = async (): Promise<void> => {
      loading.value = true

      try {
        await api.orders.cancelOrder(props.value.number)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Order has been cancelled successfully'))
      } catch {
        addErrorToast(t('Unable to cancel'))
      } finally {
        loading.value = false
        showCancelDialog.value = false
      }
    }

    return {
      showCancelDialog,
      loading,
      cancelHandler
    }
  }
})
</script>
