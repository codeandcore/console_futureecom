<template>
  <v-btn depressed :loading="loading" v-bind="$attrs" small color="secondary" @click="approveHandler">
    <div class="d-flex align-center flex-gap-8">
      <span>{{ $t('Approve') }}</span>
      <span v-if="showAmount">({{ ids.length }})</span>
      <v-icon>check</v-icon>
    </div>
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionMassApproveAction',

  props: {
    showAmount: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array as PropType<Commission[]>,
      default: () => []
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const ids = computed(() => props.items.map((item) => item.id))

    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const approveHandler = () => {
      api.commissions
        .massApproveCommission(ids.value)
        .then(() => {
          root.$toast.addSuccessToast('Commissions were approved')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to approve commissions')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      approveHandler,
      ids
    }
  }
})
</script>
