<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'StoreActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Store>,
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
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.settings
        .deleteStore(props.value)
        .then(() => {
          addSuccessToast(t('Deleted store'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete store'))
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
