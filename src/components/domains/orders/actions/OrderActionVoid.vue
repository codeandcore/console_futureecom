<template>
  <v-dialog v-model="showVoidDialog" max-width="800" scrollable>
    <template #activator="{ attrs, on }">
      <v-btn
        v-bind="attrs"
        depressed
        small
        color="warning"
        data-cy="order-action-void-btn"
        v-on="on"
        @click="showVoidDialog = true"
      >
        {{ $t('Void') }}
      </v-btn>
    </template>
    <v-card v-if="showVoidDialog">
      <v-card-title class="d-flex justify-space-between">
        <span>{{ $t('Void order') }}: {{ value.number }}</span>
      </v-card-title>
      <v-divider />

      <v-card-text class="mt-4">
        <span>{{ $t('Are you sure you want to void order?') }}</span>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-space-between ma-2">
        <v-btn depressed color="secondary" text data-cy="order-action-void-no-btn" @click="showVoidDialog = false">
          {{ $t('No') }}
        </v-btn>
        <v-btn depressed color="primary" :loading="loading" data-cy="order-action-void-yes-btn" @click="voidHandler">
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
  name: 'OrderActionVoid',

  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)
    const showVoidDialog = ref(false)

    const voidHandler = async (): Promise<void> => {
      loading.value = true

      try {
        await api.orders.voidOrder(props.value.number)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Voided successfully'))
      } catch {
        addErrorToast(t('Unable to void'))
      } finally {
        loading.value = false
        showVoidDialog.value = false
      }
    }

    return {
      showVoidDialog,
      loading,
      voidHandler
    }
  }
})
</script>
