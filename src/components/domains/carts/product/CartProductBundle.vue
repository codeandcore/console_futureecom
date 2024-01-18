<template>
  <v-progress-circular v-if="loading" size="50" color="primary" indeterminate class="" />
  <div v-else-if="components.length > 0">
    <div v-for="(component, index) in components" :key="`component-bundle-${index}`" class="my-3">
      <cart-preview-item-overview
        v-if="!component.hasVariants"
        :value="component.item"
        :product-id="component.item.id"
      />
      <div v-if="component.hasVariants">
        <span class="text-body-1">{{ component.item.name }} x</span>
        <cart-product-variant-select v-model="component.selected" :product="component.item" class="mt-3" />
      </div>
      <v-divider />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import { getComponentIds, hasVariants } from '@futureecom/futureecom-js/dist/helpers/catalog/product-helpers'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import CartPreviewItemOverview from '@/components/domains/carts/preview/items/OrderablePreviewItemOverview.vue'
import CartProductVariantSelect from '@/components/domains/carts/product/CartProductVariantSelect.vue'
import useApi from '@/composable/useApi'
import type { OrderableItemComponent } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product, ProductBundle, ProductComponent } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

interface TempBaseCartItemComponent extends OrderableItemComponent {
  item: Product
  selected: Product | null
  hasVariants: boolean
}

export default defineComponent({
  name: 'CartProductBundle',

  components: { CartPreviewItemOverview, CartProductVariantSelect },

  props: {
    product: {
      type: Object as PropType<ProductBundle>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const loading = ref(true)
    const components = ref<TempBaseCartItemComponent[]>([])

    const getProducts = (): void => {
      useApi()
        .catalog.bulkGetProducts(getComponentIds(props.product), ['children'])
        .then((val) => (components.value = getConfiguredComponents(val)))
        .catch(() => addErrorToast(t('Unable to fetch products')))
        .finally(() => (loading.value = false))
    }

    const getConfiguredComponents = (val: Product[]): TempBaseCartItemComponent[] => {
      return val.reduce<TempBaseCartItemComponent[]>((prev, current) => {
        const comp = (props.product.components || []).find((comp: ProductComponent) => comp.id === current.id)

        if (!comp) {
          return prev
        }

        return [
          ...prev,
          {
            item: current,
            selected: null,
            hasVariants: hasVariants(current),
            id: current.id,
            key: comp.key,
            quantity: comp.quantity
          }
        ]
      }, [])
    }

    watch(
      components,
      () => {
        const comp = components.value.map((comp) => {
          const { selected, hasVariants, id, key, quantity } = comp
          const obj: OrderableItemComponent = { id, key, quantity }

          if (hasVariants) {
            obj['id'] = selected?.id || ''
            obj['parent_id'] = id
          }

          return obj
        })

        emit('input', comp)
      },
      { deep: true }
    )

    getProducts()

    return {
      components
    }
  }
})
</script>
