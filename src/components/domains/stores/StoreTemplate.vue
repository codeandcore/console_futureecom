<template>
  <v-combobox
    v-bind="$attrs"
    v-model.trim="selectedTemplate"
    :items="templates"
    outlined
    item-text="name"
    item-value="code"
    :label="$t('Store\'s template')"
    :loading="loading"
    hide-details="auto"
    @input="templateCode = $event.code"
  >
    <template #item="{ item }">
      <div class="d-flex flex-column">
        <span>{{ item.name }}</span>
        <span class="grey--text text-caption">{{ $t('Code') }}: {{ item.code }}</span>
      </div>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Template } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'StoreTemplate',

  props: {
    value: {
      type: Object as PropType<Store>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const templateCode = computed({
      get: () => props.value.template,
      set: (template) => emit('input', { ...props.value, template })
    })

    const templates = ref<Template[]>([])
    const loading = ref<boolean>(false)
    const selectedTemplate = ref<Template>()

    const { canRead } = useCrudChecker('cms\\template')

    const fetchTemplates = () => {
      loading.value = true
      const { organisation, id: store } = props.value
      useApi({ organisation, store })
        .cms.templates({ perPage: -1 })
        .then((val) => {
          templates.value = val.data
          selectedTemplate.value = templates.value.find((item) => item.code === templateCode.value)
        })
        .catch(() => addErrorToast(t('Unable to fetch templates')))
        .finally(() => (loading.value = false))
    }

    if (canRead.value) {
      fetchTemplates()
    }

    return {
      selectedTemplate,
      templates,
      loading,
      templateCode
    }
  }
})
</script>
