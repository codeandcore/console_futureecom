<template>
  <div class="d-flex flex-column flex-gap-32">
    <div class="d-flex justify-end">
      <v-btn depressed color="primary" @click="dimensions = null">
        <div class="d-flex flex-gap-16 align-center">
          <span>{{ $t('Unset dimensions') }}</span>
          <v-icon>restart_alt</v-icon>
        </div>
      </v-btn>
    </div>
    <div class="d-flex flex-gap-16">
      <product-dimensions-length v-model="dimensions" :error-messages="errorMessages.length" />
      <product-dimensions-width v-model="dimensions" :error-messages="errorMessages.width" />
      <product-dimensions-height v-model="dimensions" :error-messages="errorMessages.height" />
    </div>
    <div class="d-flex flex-gap-16">
      <product-dimensions-weight v-model="dimensions" :error-messages="errorMessages.weight" />
    </div>
    <div class="d-flex flex-gap-16">
      <product-dimensions-size-unit v-model="dimensions" :messages="defaultSizeMessage" />
      <product-dimensions-weight-unit v-model="dimensions" :messages="defaultWeightMessage" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import ProductDimensionsHeight from '@/components/domains/products/inputs/ProductDimensionsHeight.vue'
import ProductDimensionsLength from '@/components/domains/products/inputs/ProductDimensionsLength.vue'
import ProductDimensionsSizeUnit from '@/components/domains/products/inputs/ProductDimensionsSizeUnit.vue'
import ProductDimensionsWeight from '@/components/domains/products/inputs/ProductDimensionsWeight.vue'
import ProductDimensionsWeightUnit from '@/components/domains/products/inputs/ProductDimensionsWeightUnit.vue'
import ProductDimensionsWidth from '@/components/domains/products/inputs/ProductDimensionsWidth.vue'
import type { CatalogDimensions } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { Product, ProductDimensions } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductDimensions',

  components: {
    ProductDimensionsWeight,
    ProductDimensionsHeight,
    ProductDimensionsWidth,
    ProductDimensionsLength,
    ProductDimensionsWeightUnit,
    ProductDimensionsSizeUnit
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { getSettings } = useSettings()
    const settingDimensions = getSettings<CatalogDimensions>('catalog.dimensions').value

    const defaultSizeMessage = computed((ctx) => {
      return dimensions.value?.size_unit ? '' : `${ctx.$t('Default')}: ${settingDimensions.size_unit}`
    })

    const defaultWeightMessage = computed((ctx) => {
      return dimensions.value?.weight_unit ? '' : `${ctx.$t('Default')}: ${settingDimensions.weight_unit}`
    })

    const sizeKeys: (keyof ProductDimensions)[] = ['length', 'width', 'height']

    const dimensions = computed({
      get: () => props.value.dimensions,
      set: (dimensions: Product['dimensions']) => {
        const dimensionKeys: (keyof ProductDimensions)[] = [...sizeKeys, 'weight']

        if (!dimensions || dimensionKeys.every((dimension) => dimensions[dimension] == null)) {
          emit('input', { ...props.value, dimensions: null })
          return
        }

        const filledDimensions = dimensionKeys.reduce((prev, curr) => {
          return { ...prev, [curr]: dimensions[curr] !== undefined ? dimensions[curr] : null }
        }, {})

        const dimensionsToEmit: ProductDimensions = {
          ...filledDimensions,
          size_unit: dimensions.size_unit,
          weight_unit: dimensions.weight_unit
        }

        emit('input', { ...props.value, dimensions: dimensionsToEmit })
      }
    })

    const isWeightPresent = computed(() => (dimensions.value || {})['weight'] != null)
    const isAnySizePresent = computed(() => {
      return sizeKeys.some((dimension) => (dimensions.value || {})[dimension] != null)
    })

    const errorMessages = computed((ctx): Record<'weight' | 'length' | 'width' | 'height', (string | boolean)[]> => {
      const defaultErrors = { weight: [], length: [], width: [], height: [] }

      if (!dimensions.value) {
        return defaultErrors
      }

      const getError = (dimension?: number | null): string[] => {
        const errors = []
        if (dimension == null) {
          errors.push(ctx.$t('Field cannot be empty').toString())
        }
        if (Number(dimension || 0) < 0) {
          errors.push(ctx.$t('Value cannot be negative').toString())
        }
        return errors
      }

      if (isAnySizePresent.value && isWeightPresent.value) {
        return {
          weight: getError(dimensions.value.weight),
          length: getError(dimensions.value.length),
          width: getError(dimensions.value.width),
          height: getError(dimensions.value.height)
        }
      }

      if (isAnySizePresent.value && !isWeightPresent.value) {
        return {
          weight: [],
          length: getError(dimensions.value.length),
          width: getError(dimensions.value.width),
          height: getError(dimensions.value.height)
        }
      }

      if (!isAnySizePresent.value && isWeightPresent.value) {
        return {
          weight: getError(dimensions.value.weight),
          length: [],
          width: [],
          height: []
        }
      }

      return defaultErrors
    })

    return {
      dimensions,
      errorMessages,
      defaultSizeMessage,
      defaultWeightMessage
    }
  }
})
</script>
