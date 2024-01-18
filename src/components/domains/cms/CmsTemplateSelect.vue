<template>
  <v-select
    v-bind="$attrs"
    v-model="template"
    :items="templateList"
    outlined
    :label="`${$t('Template')}`"
    item-value="code"
    :item-text="(item) => `${item.name} (${item.code})`"
    :loading="loading"
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Template } from '@futureecom/futureecom-js/dist/services/cms-service'

export default defineComponent({
  name: 'CmsTemplateSelect',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const loading = ref(true)
    const templateList = ref<Template[]>()

    const template = computed({
      get: (): string => props.value,
      set: (val): void => emit('input', val)
    })

    useApi()
      .cms.templates({ perPage: -1 })
      .then((val) => {
        templateList.value = val.data
        template.value = val.data.find((item) => item.code === props.value)?.code || val.data[0].code
      })
      .catch(() => {})
      .finally(() => (loading.value = false))

    return {
      templateList,
      loading,
      template
    }
  }
})
</script>
