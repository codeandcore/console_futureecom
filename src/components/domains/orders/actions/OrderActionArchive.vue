<template>
  <v-btn
    small
    depressed
    text
    color="primary"
    :loading="loading"
    data-cy="order-action-archive-btn"
    @click="archiveHandler"
  >
    {{ $t('Archive') }}
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
  name: 'OrderActionArchive',

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

    const archiveHandler = async (): Promise<void> => {
      loading.value = true

      try {
        await api.orders.archiveOrder(props.value.number)
        await api.orders.getOrder(props.value.number).then((val) => emit('input', val))
        addSuccessToast(t('Order archived successfully'))
      } catch (e) {
        addErrorToast(t('Unable to archive'))
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      archiveHandler
    }
  }
})
</script>
