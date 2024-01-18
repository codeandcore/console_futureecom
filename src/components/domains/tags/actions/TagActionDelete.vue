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
import type { Tag } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TagActionDelete',
  components: { DeleteButton },
  props: {
    value: {
      type: Object as PropType<Tag>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    'success': () => true,
    'error': (_: unknown) => true,
    'update:loading': (_: boolean) => true
  },
  setup(props, { emit }) {
    const { addSuccessToast, addErrorToast } = useToasts()
    const { t } = useI18n()
    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)
    const deleteHandler = async (): Promise<void> => {
      loading.value = true
      emitLoadingState()
      api.catalog
        .deleteTag(props.value.id)
        .then(() => {
          emit('success')
          addSuccessToast(t('Deleted tag'))
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete tag'))
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
