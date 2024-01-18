<template>
  <v-btn depressed text color="error" v-bind="$attrs" :loading="loading" @click="deleteHandler">
    {{ $t('Delete') }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionActionDelete',

  props: {
    value: {
      type: Object as PropType<{ id: string; [key: string]: any }>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.promotions
        .deletePromotion(props.value.id)
        .then((val) => {
          root.$toast.addSuccessToast('Deleted promotion')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to delete promotion')
          emit('onError', err)
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
