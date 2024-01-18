<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrganisationActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Organisation>,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    'success': () => true,
    'error': (_: unknown) => true,
    'update:loading': (_: boolean) => true
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

      api.settings
        .deleteOrganisation(props.value.id)
        .then(() => {
          addSuccessToast(t('Deleted organisation'))
          emit('success')
        })
        .catch((err) => {
          addErrorToast(t('Unable to delete organisation'))
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
