<template>
  <div>
    <v-select
      v-bind="$attrs"
      v-model="taxBasedOnSource"
      :items="items"
      :label="$t('Based on source')"
      outlined
      item-text="text"
      item-value="value"
      hide-details="auto"
    />
    <ul class="text-caption">
      <li>{{ $t('"origin" uses store address to calculate taxes') }}</li>
      <li>
        {{ $t('general.settings.taxes.destination_source') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxesBasedOnSource',

  props: {
    value: {
      type: Object as PropType<TaxesSettings>,
      default: null
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const taxBasedOnSource = computed({
      get: () => props.value.tax_based_on_source,
      set: (tax_based_on_source) => emit('input', { ...props.value, tax_based_on_source })
    })

    const items = computed(() => [
      { text: t('Origin'), value: 'origin' },
      { text: t('Destination'), value: 'destination' }
    ])

    return {
      items,
      taxBasedOnSource
    }
  }
})
</script>
