<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" data-cy="client-actions-delete" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Client>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    'update:loading': (_loading: boolean) => true,
    'success': () => true,
    'error': (_val: any) => true
  },

  setup(props, { emit }) {
    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.auth
        .deleteClient(props.value.id)
        .then(() => {
          addSuccessToast('Deleted client')
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete client'))
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
