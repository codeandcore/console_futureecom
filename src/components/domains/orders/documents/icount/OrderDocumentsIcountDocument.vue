<template>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title class="d-flex flex-gap-8">
        <span>{{ $t('Reference') }}:</span>
        <span class="text-capitalize">{{ document.reference_type.replace('_', ' ') }}</span>
        <span>#{{ document.reference_number }}</span>
      </v-list-item-title>
      <v-list-item-subtitle class="d-flex flex-column flex-gap-8 mt-4">
        <div class="d-flex flex-gap-4">
          <span>{{ $t('Status') }}:</span>
          <span :class="statusClass">{{ document.status }}</span>
        </div>
        <div v-if="document.status === 'success'" class="d-flex flex-gap-4">
          <span>{{ $t('iCount number') }}:</span>
          <span class="font-weight-bold">{{ document.docnum }}</span>
        </div>
        <span v-if="document.status === 'error'" :class="statusClass">{{ $t(document.message) }}</span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        v-if="document.status === 'error'"
        :disabled="loading"
        :loading="loading"
        icon
        color="secondary"
        @click="refetchHandler"
      >
        <v-icon>autorenew</v-icon>
      </v-btn>
      <button-action v-else icon-name="print" icon color="primary" :label="$t('Print')" @click="printDocument" />
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import useApi from '@/composable/useApi'
import type { OrderDocumentICountDocument } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderDocumentIcountDocument',
  components: { ButtonAction },

  props: {
    value: {
      type: Object as PropType<OrderDocumentICountDocument>,
      required: true
    },
    orderNumber: {
      type: String,
      required: true
    }
  },

  emits: ['document-updated'],

  setup(props, { root, emit }) {
    const document = ref<OrderDocumentICountDocument>(props.value)
    const loading = ref(false)

    const refetchHandler = () => {
      loading.value = true

      const payload = {
        number: document.value.reference_number,
        type: document.value.reference_type
      }
      useApi()
        .orders.icountResend(props.orderNumber, payload)
        .then(() => {
          root.$toast.addSuccessToast(root.$t('Resending document to iCount'))
          emit('document-updated')
        })
        .finally(() => (loading.value = false))
    }

    const printDocument = () => (document.value.status === 'success' ? window.open(document.value.link) : void 0)
    const statusClass = computed(() => `${document.value.status}--text`)

    return {
      document,
      loading,
      refetchHandler,
      statusClass,
      printDocument
    }
  }
})
</script>
