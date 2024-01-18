<template>
  <v-tooltip bottom outlined>
    <template #activator="{ on, attrs }">
      <v-btn
        depressed
        fab
        :loading="loading"
        v-bind="{ ...$attrs, ...attrs }"
        small
        v-on="on"
        @click="unapproveHandler"
      >
        <v-icon small>cancel</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('Unapprove') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Commission } from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CommissionUnapproveAction',

  props: {
    value: {
      type: Object as PropType<Commission>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()

    const loading = ref(false)
    const emitLoadingState = () => emit('update:loading', loading.value)

    const unapproveHandler = () => {
      api.commissions
        .unapproveCommission(props.value.id)
        .then(() => {
          root.$toast.addSuccessToast('Commission was unapproved')
          emit('onSuccess')
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to unapprove commission')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          emitLoadingState()
        })
    }

    return {
      loading,
      unapproveHandler
    }
  }
})
</script>
