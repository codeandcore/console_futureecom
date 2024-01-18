<template>
  <expandable-content outlined>
    <template #title>
      <selectable-resource-header :errors="chipErrors" :title="$t('Products')" :items="value.product_ids">
        <template #subtitle>
          <span v-if="(value.product_ids || []).length" class="text-caption grey--text">
            {{ $t('May include not listed children') }}
          </span>
        </template>
      </selectable-resource-header>
    </template>
    <template #content>
      <v-divider />
      <selectable-products
        v-model="vat"
        :grid-options="gridOptions"
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
import SelectableProducts from '@/components/common/selectables/resources/SelectableProducts.vue'
import SelectableResourceHeader from '@/components/common/selectables/SelectableResourceHeader.vue'
import type { PropType } from '@vue/composition-api'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ValidationErrors } from '@/types/validator'
import type { Vat } from '@futureecom/futureecom-js/dist/services/tax-service'

export default defineComponent({
  name: 'VatRateProducts',
  components: { SelectableResourceHeader, SelectableProducts, ExpandableContent },
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

    const gridOptions = computed(() => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Image'), value: 'image_url' },
        { text: t('Name'), value: 'name' },
        { text: t('SKU'), value: 'sku' },
        { text: t('Classification'), value: 'classification' }
      ]

      return { headers }
    })

    const chipErrors = computed(() => getChipErrors('product_ids', props.errors))

    return {
      vat,
      gridOptions,
      chipErrors
    }
  }
})
</script>
