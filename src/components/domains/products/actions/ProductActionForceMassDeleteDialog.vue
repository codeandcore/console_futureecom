<template>
  <force-mass-delete-dialog
    v-model="errors"
    :items="items"
    :loading="loading"
    :headers="headers"
    @delete="deleteHandler"
  >
    <template #item.image_url="{ item }">
      <v-img :src="item.image_url" height="75" width="75" class="my-3 rounded-lg" />
    </template>
    <template #item.sku="{ item }">
      <router-link :to="{ name: 'product-update', params: { id: item.id } }">
        {{ item.sku }}
      </router-link>
    </template>
    <template #item.message="{ item }">
      <span class="error--text">{{ item.message }}</span>
    </template>
  </force-mass-delete-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ForceMassDeleteDialog from '@/components/common/actions/ForceMassDeleteDialog.vue'
import useApi from '@/composable/useApi'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductActionForceMassDeleteDialog',
  components: { ForceMassDeleteDialog },

  props: {
    value: {
      type: Object as PropType<MassDeleteError | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<Product[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addSuccessToast, addErrorToast } = useToasts()

    const errors = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const api = useApi()
    const loading = ref(false)

    const emitLoadingState = () => emit('update:loading', loading.value)

    const deleteHandler = (force_ids: string[]) => {
      loading.value = true
      emitLoadingState()

      api.catalog
        .massDeleteProducts({ force_ids })
        .then((val) => {
          addSuccessToast(t('Products deleted'))
          emit('success', val)
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete products'))
          emit('error', err)
        })
        .finally(() => {
          loading.value = false
          errors.value = undefined
          emitLoadingState()
        })
    }

    const headers = computed(() => [
      { text: t('Image'), value: 'image_url', sortable: false },
      { text: t('SKU'), value: 'sku' },
      { text: t('Name'), value: 'name' },
      { text: t('Error'), value: 'message', sortable: false }
    ])

    return {
      errors,
      headers,
      loading,
      deleteHandler
    }
  }
})
</script>
