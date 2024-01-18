<template>
  <delete-button v-bind="{ ...$attrs, loading, label }" @click="deleteHandler" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductActionMassDelete',

  components: { DeleteButton },

  inheritAttrs: false,

  props: {
    items: {
      type: Array as PropType<Product[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()

    const loading = ref(false)
    const ids = computed(() => props.items.map((item) => item.id))

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.catalog
        .massDeleteProducts({ ids: ids.value })
        .then(() => {
          addSuccessToast(t('Deleted products'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete products'))
          emit('error', err.response?.data)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    const label = computed(() => (ids.value.length ? `${t('Delete')} (${ids.value.length})` : undefined))

    return {
      deleteHandler,
      loading,
      label
    }
  }
})
</script>
