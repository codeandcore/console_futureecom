<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable>
    <template #activator="{ attrs, on }">
      <v-btn
        v-bind="{ ...$attrs, attrs }"
        small
        depressed
        color="primary"
        :loading="loading.updateAttributes"
        v-on="on"
      >
        {{ $t('Update attributes') }}
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <h3>{{ $t('Select attributes to update') }}</h3>

        <v-btn icon @click="showDialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <selectable-product-attributes v-model="selectedAttributes" :items="allowedAttributes" />
      </v-card-text>

      <v-divider />

      <v-card-actions class="d-flex justify-end ma-2">
        <div v-if="hasProductChanged" class="d-flex flex-column flex-gap-16">
          <span>
            {{
              $t(
                'You have unsaved changes in your product. Without saving first, the updated variants will not include these changes. Would you like to save the product first and then update the variants?'
              )
            }}
          </span>
          <div class="d-flex justify-space-between">
            <v-btn color="secondary" depressed small :disabled="loading.updateAttributes" @click="propagateAttributes">
              {{ $t('Update without changes') }}
            </v-btn>
            <v-btn color="primary" :loading="loading.productUpdate" depressed small @click="updateProductFirst">
              {{ $t('Save changes and update') }}
            </v-btn>
          </div>
        </div>
        <v-btn v-else color="primary" depressed :disabled="loading.updateAttributes" @click="propagateAttributes">
          {{ $t('Update variants') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { getProductWithoutVariants } from '@/libs/domains/catalog/products'
import { useI18n } from 'vue-i18n-bridge'
import { useProduct } from '@/composable/resources/useProduct'
import { useToasts } from '@/composable/useToasts'
import SelectableProductAttributes from '@/components/domains/products/SelectableProductAttributes.vue'
import dotProp from 'dot-prop'
import useApi from '@/composable/useApi'
import type { Product, ProductConfigurable } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

interface SelectableAttributes {
  text: string
  value: string
  children?: SelectableAttributes[]
}

export default defineComponent({
  name: 'ProductActionVariantsPropagation',
  components: { SelectableProductAttributes },

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<ProductConfigurable>,
      required: true
    },
    items: {
      type: Array as PropType<Product[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const api = useApi()
    const selectedAttributes = ref([])

    const product = computed(() => structuredClone(props.value))
    const hasProductChanged = ref(false)

    const showDialog = ref(false)
    const loading = reactive({
      productUpdate: false,
      updateAttributes: false
    })

    watch(product, () => (hasProductChanged.value = true), { deep: true })

    const emitLoadingState = () => emit('update:loading', loading.productUpdate || loading.updateAttributes)

    const allowedAttributes = computed<SelectableAttributes[]>(() => {
      return [
        {
          text: 'Inventory',
          value: 'inventory',
          children: [
            { text: 'Policy', value: 'inventory.policy' },
            { text: 'Trackable', value: 'inventory.track' },
            { text: 'Restockable', value: 'inventory.is_restockable' },
            { text: 'Available', value: 'inventory.is_available' },
            { text: 'Quantity', value: 'inventory.quantity' },
            { text: 'Min per order', value: 'inventory.min_per_order' },
            { text: 'Max per order', value: 'inventory.max_per_order' },
            { text: 'Bundle exclusive', value: 'inventory.is_bundle_exclusive' }
          ]
        },
        { text: 'Translations', value: 'translations' },
        { text: 'Properties', value: 'properties' },
        { text: 'Type', value: 'type' },
        { text: 'Brand', value: 'brand_id' },
        { text: 'Price', value: 'price' },
        { text: 'Sale Price', value: 'sale_price' },
        { text: 'Gross Price', value: 'gross_price' },
        { text: 'Gross Sale Price', value: 'gross_sale_price' },
        { text: 'Tags', value: 'tag_ids' },
        { text: 'Taxonomy', value: 'taxonomy_id' },
        { text: 'Image', value: 'image_url' },
        { text: 'Application Restrictions', value: 'application' },
        { text: 'Related Products/Taxonomy', value: 'related' },
        { text: 'Sort Order', value: 'order' },
        { text: 'Customer Groups Restrictions', value: 'customer_group' },
        { text: 'Tier Prices', value: 'tiers' }
      ]
    })

    const getConvertedAttributes = (): any[] => {
      const selectedObject: Record<string, string> = {}
      let selected: (string | any[])[] = []

      selectedAttributes.value.forEach((attr: string) => {
        const isChildlessParent = allowedAttributes.value.find((item) => item.value === attr && item.children)
        if (isChildlessParent) {
          return
        }

        const [parent, child] = attr.split('.')

        if (!child) {
          selected = [...selected, attr]
          return
        }

        const objArray = dotProp.get(selectedObject, parent) || []
        dotProp.set(selectedObject, parent, Array.isArray(objArray) ? [...objArray, child] : [child])
      })

      return [...selected, ...Object.keys(selectedObject).map((key) => ({ [key]: selectedObject[key] }))]
    }

    const updateProductFirst = async () => {
      loading.productUpdate = true
      emitLoadingState()

      const { cleanTranslations } = useProduct()

      const product = cleanTranslations(getProductWithoutVariants(structuredClone(props.value)))

      api.catalog
        .updateProduct(props.value.id, product)
        .then(() => propagateAttributes())
        .catch(() => addErrorToast(t('Unable to update product')))
        .finally(() => {
          loading.productUpdate = false
          emitLoadingState()
        })
    }

    const propagateAttributes = () => {
      const data = {
        ids: props.items.map((item) => item.id),
        attributes: getConvertedAttributes()
      }

      loading.updateAttributes = true
      emitLoadingState()

      api.catalog
        .updateProductVariantAttributes(props.value.id, data)
        .then((value) => emit('input', value))
        .catch(() => addErrorToast(t('Unable to propagate attributes')))
        .finally(() => {
          showDialog.value = false
          loading.updateAttributes = false
          emitLoadingState()
        })
    }

    return {
      showDialog,
      selectedAttributes,
      allowedAttributes,
      propagateAttributes,
      loading,
      hasProductChanged,
      updateProductFirst
    }
  }
})
</script>
