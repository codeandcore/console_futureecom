<template>
  <div class="d-flex flex-column">
    <v-expansion-panels v-if="isEnabled">
      <v-expansion-panel :disabled="!hasIcountDocuments">
        <v-expansion-panel-header>
          <div class="d-flex flex-column">
            <span class="d-flex flex-gap-8">
              <span>{{ $t('iCount documents') }}</span>
              <span v-if="hasIcountDocuments">({{ (value.icount || []).length }})</span>
            </span>
            <span v-if="!hasIcountDocuments" class="mt-2 text-caption">{{ $t('No documents to display') }}</span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-if="hasIcountDocuments">
          <div v-for="(document, index) in value.icount" :key="`icount-${index}`">
            <v-divider v-if="index > 0" />
            <order-document-icount-document
              :value="document"
              :order-number="value.number"
              @document-updated="$emit('update')"
            />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <order-document-table class="my-4" :value="value" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import OrderDocumentIcountDocument from '@/components/domains/orders/documents/icount/OrderDocumentsIcountDocument.vue'
import OrderDocumentTable from '@/components/domains/orders/documents/OrderDocumentTable.vue'
import type { Order } from '@futureecom/futureecom-js/dist/services/order-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderDocuments',
  components: { OrderDocumentIcountDocument, OrderDocumentTable },
  props: {
    value: {
      type: Object as PropType<Order>,
      required: true
    }
  },

  setup(props) {
    const icountPlugin = useSettings().getStoreSetting('plugins.futureecom/icount')
    const icountSettings = useSettings().getStoreSetting('general.icount')
    const hasIcountDocuments = computed(() => !!(props.value.icount || []).length)

    const isEnabled = icountPlugin?.enabled && icountSettings?.enabled

    return {
      hasIcountDocuments,
      isEnabled
    }
  }
})
</script>
