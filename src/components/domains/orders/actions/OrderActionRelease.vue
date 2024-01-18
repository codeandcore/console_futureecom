<template>
  <v-btn small depressed color="primary" :loading="loading" data-cy="order-action-release-btn" @click="releaseHandler">
    {{ $t('Release') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderActionRelease',
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

    const releaseHandler = async (): Promise<void> => {
      loading.value = true

      try {
        await api.orders.releaseOrder(props.value.number)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Order released successfully'))
      } catch {
        addErrorToast(t('Unable to release'))
      } finally {
        loading.value = false
      }
    }

    return {
      releaseHandler,
      loading
    }
  }
})
</script>
