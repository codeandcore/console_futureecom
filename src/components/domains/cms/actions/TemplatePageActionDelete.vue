<template>
  <delete-button v-bind="{ ...$attrs, icon, loading }" @click="deleteHandler" />
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import useApi from '@/composable/useApi'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TemplatePageActionDelete',
  components: { DeleteButton },

  props: {
    value: {
      type: Object as PropType<Page>,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    icon: {
      type: Boolean,
      default: false
    }
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
      api.cms
        .deletePage(props.code, props.value.id)
        .then((val) => {
          addSuccessToast(t("Deleted template's page"))
          emit('onSuccess', val)
        })
        .catch((err) => {
          addErrorToast(t("Unable to delete template's page"))
          emit('onError', err)
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
