<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Webhook } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'WebhookActionDelete',
  components: { DeleteButton },
  props: {
    value: {
      type: Object as PropType<Webhook>,
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
      api.notifications
        .deleteWebhook(props.value.id)
        .then(() => {
          root.$toast.addSuccessToast('Deleted webhook')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast(root.$t('Unable to delete webhook'))
          root.$toast.addErrorToast('onError', err.response?.data)
          emit('onError', err.response?.data)
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
