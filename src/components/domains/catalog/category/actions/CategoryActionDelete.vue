<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Category } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CategoryActionDelete',
  components: { DeleteButton },
  props: {
    value: {
      type: Object as PropType<Category>,
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
      api.catalog
        .deleteCategory(props.value.id)
        .then(() => {
          root.$toast.addSuccessToast('Deleted category')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast(root.$t('Unable to delete category'))
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
