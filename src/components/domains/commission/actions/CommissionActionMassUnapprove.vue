<template>
  <v-btn depressed :loading="loading" v-bind="$attrs" small color="secondary" @click="unapproveHandler">
    <div class="d-flex align-center flex-gap-8">
      <span>{{ $t('Unapprove') }}</span>
      <span v-if="showAmount">({{ ids.length }})</span>
      <v-icon>cancel</v-icon>
    </div>
  </v-btn>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionMassUnapproveAction',

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

    const ids = computed(() => props.items.map(({ id }) => id))

    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const unapproveHandler = () => {
      api.commissions
        .massUnapproveCommission(ids.value)
        .then(() => {
          root.$toast.addSuccessToast('Commissions were unapproved')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to unapprove commissions')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      unapproveHandler,
      ids
    }
  }
})
</script>
