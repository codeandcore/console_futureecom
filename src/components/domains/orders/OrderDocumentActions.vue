<template>
  <div class="d-flex flex-gap-8">
    <button-action
      v-if="canDownload"
      icon-name="download"
      icon
      color="primary"
      :label="$t('Download')"
      :loading="loadingDownload"
      :disabled="loadingPrint"
      @click="documentActionHandler('download')"
    />
    <button-action
      icon-name="print"
      icon
      color="primary"
      :label="$t('Print')"
      :loading="loadingPrint"
      :disabled="loadingDownload"
      @click="documentActionHandler('print')"
    />
  </div>
</template>

<script lang="ts">
import { dataLoader } from '@/composable/loaders/dataLoader'
import { defineComponent } from '@vue/composition-api'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import useApi from '@/composable/useApi'
import type { OrderDocument } from '@futureecom/futureecom-js/dist/services/order-service'

type DocumentAction = 'download' | 'print'

export default defineComponent({
  name: 'OrderDocumentActions',

  components: { ButtonAction },

  props: {
    orderId: {
      type: String,
      required: true
    },
    value: {
      type: Object as () => OrderDocument,
      required: true
    }
  },

  setup(props) {
    const canDownload = /^((?!android).)*safari/i.test(navigator.userAgent)

    const downloadLoader = dataLoader()
    const printLoader = dataLoader()

    const documentActionHandler = (action: DocumentAction): void => {
      const loader = action === 'download' ? downloadLoader : printLoader
      loader
        .loadData(() => {
          return new Promise((resolve, reject) =>
            useApi()
              .client.post(`/orders/orders/${props.orderId}/documents/${props.value.id}`, undefined, {
                responseType: 'arraybuffer'
              })
              .then((res) => resolve(res.data?.data || res.data))
              .catch((err) => reject(err))
          )
        })
        .then(() => {
          documentAction(loader.data.value, action)
        })
    }

    const documentAction = (buffer: string, action: DocumentAction): void => {
      const file = Buffer.from(buffer, 'binary')
      const url = window.URL.createObjectURL(new Blob([file], { type: 'application/pdf;base64' }))
      const link = document.createElement('a')

      const pdfName = `${props.value.type}_${props.value.number}.pdf`

      link.setAttribute(action, pdfName)
      link.href = url
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
    }

    return {
      canDownload,
      documentActionHandler,
      loadingDownload: downloadLoader.loading,
      loadingPrint: printLoader.loading
    }
  }
})
</script>
