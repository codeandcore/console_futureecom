<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { TaxRateGroup } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'SaleTaxGroupActionDelete',

  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<TaxRateGroup>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    'success': () => true,
    'error': (_?: unknown) => true,
    'update:loading': (_?: boolean) => true
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const api = useApi()
    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = () => {
      loading.value = true
      emitLoadingState()

      api.taxes
        .deleteTaxRateGroup(props.value.id)
        .then(() => {
          addSuccessToast(t('Deleted sale tax group'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete sale tax group'))
          emit('error', err)
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
