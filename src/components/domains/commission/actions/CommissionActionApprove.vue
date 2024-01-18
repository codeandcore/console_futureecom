<template>
  <v-tooltip bottom outlined>
    <template #activator="{ on, attrs }">
      <v-btn depressed fab :loading="loading" v-bind="{ ...$attrs, ...attrs }" small v-on="on" @click="approveHandler">
        <v-icon small>check</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('Approve') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionApproveAction',

  inheritAttrs: false,

  props: {
    value: {
      type: [] as PropType<Commission>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const approveHandler = () => {
      api.commissions
        .approveCommission(props.value.id)
        .then(() => {
          root.$toast.addSuccessToast('Commission was approved')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to approve commission')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      approveHandler
    }
  }
})
</script>
