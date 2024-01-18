<template>
  <div>
    <v-select
      v-for="variant in product.variants"
      :key="variant.key"
      v-model="selectedVariants[variant.key]"
      dense
      outlined
      :label="variant.name"
      :items="variant.options"
      :rules="rules"
      hide-details="auto"
      class="mb-3"
      @input="emitSelectedVariant"
    />
  </div>
</template>

<script lang="ts">
import { ValidationRule, useNotEmptyValidationRule } from '@/composable/validationRules'
import { defineComponent, ref } from '@vue/composition-api'
import { getVariants } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import type {
  ProductConfigurable,
  ProductProperty,
  ProductVariant
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

interface SelectedProperties {
  [propertyKey: string]: string | number
}

export default defineComponent({
  name: 'CartProductVariantSelect',

  props: {
    product: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    }
  },

  setup(props, { emit }) {
    const selectedVariants = ref<SelectedProperties>({})

    const emitSelectedVariant = (): void => {
      const variants: ProductVariant[] = getVariants(props.product)

      if (Object.keys(selectedVariants.value).length !== variants.length) {
        return
      }

      props.product.children?.forEach((item) => {
        const result = Object.entries(selectedVariants.value).every(([key, value]) => {
          return !!item.properties?.find((property: ProductProperty) => {
            return property.key === key && property.value === value
          })
        })

        if (result) {
          emit('input', item)
        }
      })
    }

    const selectFirst = (): void => {
      getVariants({ variants: props.product.variants }).forEach((variant: ProductVariant) => {
        if (variant.options.length === 1 && variant.key) {
          selectedVariants.value[variant.key] = variant.options[0]
        }
      })

      emitSelectedVariant()
    }

    selectFirst()

    const rules = [(val: string): ValidationRule => useNotEmptyValidationRule(val)]

    return {
      selectedVariants,
      emitSelectedVariant,
      rules
    }
  }
})
</script>
