<template>
  <expandable-content outlined>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Shipping methods')" :items="value.shipping_ids" />
    </template>
    <template #content>
      <v-divider />
      <selectable-shipping-methods
        v-model="vat"
        :grid-options="shippingMethodOptions"
        show-chips
        multiple
        class="ma-4"
        :errors="chipErrors"
      />
    </template>
  </expandable-content>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { getChipErrors } from '@/composable/validator/useValidator'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import SelectableShippingMethods from '@/components/common/selectables/resources/SelectableShippingMethods.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ValidationErrors } from '@/types/validator'
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateShippingMethods',

  components: { SelectableResourceHeader, SelectableShippingMethods, ExpandableContent },

  props: {
    value: {
      type: Object as PropType<Vat>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const vat = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    const shippingMethodOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]

      return { headers }
    })

    const chipErrors = computed(() => getChipErrors('shipping_ids', props.errors))

    return {
      vat,
      shippingMethodOptions,
      chipErrors
    }
  }
})
</script>
