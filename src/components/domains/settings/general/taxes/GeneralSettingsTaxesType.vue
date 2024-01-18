<template>
  <v-select
    v-bind="$attrs"
    v-model="type"
    :items="items"
    :label="$t('Tax Type')"
    outlined
    hide-details="auto"
    item-text="text"
    item-value="value"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxesType',

  props: {
    value: {
      type: Object as PropType<TaxesSettings>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const type = computed({
      get: () => props.value.type,
      set: (type) => emit('input', { ...props.value, type })
    })

    const items = computed(() => [
      { text: t('Sales'), value: 'sales' },
      { text: t('Vat'), value: 'vat' }
    ])

    return {
      items,
      type
    }
  }
})
</script>
