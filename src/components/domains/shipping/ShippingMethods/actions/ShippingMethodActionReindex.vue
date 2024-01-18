<template>
  <v-btn v-bind="$attrs" :loading="loading" depressed @click="reindexHandler">
    {{ $attrs.label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'ShippingMethodActionReindex',

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:reindexLoading', loading.value)

    const reindexHandler = () => {
      loading.value = true
      emitLoadingState()

      api.carts
        .reindexShipping()
        .then(() => root.$toast.addSuccessToast(root.$t('Shipping methods reindexed')))
        .catch((err: any) => {
          root.$toast.addErrorToast(err.response.data.message || root.$t('Unable to reindex shipping methods'))
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      reindexHandler,
      loading
    }
  }
})
</script>
