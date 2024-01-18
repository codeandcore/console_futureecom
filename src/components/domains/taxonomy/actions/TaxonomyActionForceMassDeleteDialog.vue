<template>
  <force-mass-delete-dialog
    v-model="errors"
    :items="items"
    :loading="loading"
    :headers="headers"
    @delete="deleteHandler"
  >
    <template #item.name="{ item }">
      <router-link :to="{ name: 'taxonomy-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.message="{ item }">
      <span class="error--text">{{ item.message }}</span>
    </template>
  </force-mass-delete-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ForceMassDeleteDialog from '@/components/common/actions/ForceMassDeleteDialog.vue'
import useApi from '@/composable/useApi'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { PropType } from '@vue/composition-api'
import type { Taxonomy } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'TaxonomyActionForceMassDeleteDialog',
  components: { ForceMassDeleteDialog },

  props: {
    value: {
      type: Object as PropType<MassDeleteError | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<Taxonomy[]>,
      required: true
    }
  },

  setup(props, { root, emit }) {
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
        .massDeleteTaxonomy({ force_ids })
        .then((val) => {
          root.$toast.addSuccessToast('Taxonomy deleted')
          emit('onSuccess', val)
        })
        .catch((err) => {
          root.$toast.addErrorToast('Unable to delete taxonomy')
          emit('onError', err)
        })
        .finally(() => {
          loading.value = false
          errors.value = undefined
          emitLoadingState()
        })
    }

    const headers = computed((ctx) => [
      { text: root.$t('Name'), value: 'name' },
      { text: root.$t('Code'), value: 'code' },
      { text: ctx.$t('Error'), value: 'message', sortable: false }
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
