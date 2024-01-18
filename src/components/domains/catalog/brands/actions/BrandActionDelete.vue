<template>
  <delete-button data-cy="brand-action-delete" v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Brand } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'BrandActionDelete',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Brand>,
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
    const deleteHandler = (): void => {
      loading.value = true
      emitLoadingState()
      api.catalog
        .deleteBrand(props.value.id)
        .then(() => {
          addSuccessToast(t('Deleted brand'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete brand'))
          emit('error', err)
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
