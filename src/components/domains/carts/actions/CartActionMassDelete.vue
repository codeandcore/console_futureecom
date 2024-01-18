<template>
  <delete-button v-bind="{ ...$attrs, loading, label }" @click="deleteHandler" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Cart } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartActionMassDelete',

  components: { DeleteButton },

  inheritAttrs: false,

  props: {
    items: {
      type: Array as PropType<Cart[]>,
      default: () => []
    }
  },

  setup(props, { emit, root }) {
    const api = useApi()

    const loading = ref(false)
    const ids = computed(() => props.items.map((item) => item.id))

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.carts
        .massDeleteCarts({ ids: ids.value })
        .then(() => {
          root.$toast.addSuccessToast('Deleted carts')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast(err.response?.data.message)
          emit('onError', err.response?.data)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    const label = computed((ctx) => (ids.value.length ? `${ctx.$t('Delete')} (${ids.value.length})` : undefined))

    return {
      deleteHandler,
      loading,
      label
    }
  }
})
</script>
