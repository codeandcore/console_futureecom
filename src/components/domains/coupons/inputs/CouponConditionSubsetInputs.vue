<template>
  <v-select
    v-if="type === 'type'"
    v-model="values"
    :label="$t('Type')"
    :items="getData"
    outlined
    multiple
    hide-details="auto"
  />

  <v-autocomplete
    v-else-if="type === 'brand'"
    v-model="values"
    :items="brands"
    :loading="loading"
    multiple
    outlined
    :label="$t('Brand')"
    hide-details="auto"
  />

  <selectable-resource
    v-else-if="type === 'taxonomy' && !selectSingle"
    v-model="values"
    :headers="headers[type]"
    :items="values.map((v) => ({ code: v }))"
    :resource="taxonomyCollectionResource"
    search-criteria="name"
    :can-read="productPermissions"
    item-value="code"
  >
    <template #deletable-chip-item="{ item }">
      <span>{{ item.code }} / {{ item.name }}</span>
    </template>
  </selectable-resource>

  <expandable-content v-else-if="type === 'taxonomy' && selectSingle" outlined>
    <template #title>
      <div class="d-flex justify-space-between align-center flex-grow-1">
        <span>{{ $t('Taxonomy code') }}: {{ values.join(', ') }}</span>
        <v-btn v-if="values.length" multiple-active icon @click.stop="values = []">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
    </template>
    <template #content>
      <v-divider />
      <selectable-taxonomy-tree v-model="values" item-key="code" />
    </template>
  </expandable-content>

  <selectable-resource
    v-else
    v-model="values"
    :headers="headers[type]"
    :items="values.map((v) => ({ [type]: v }))"
    :resource="productCollectionResource"
    :search-criteria="type"
    :can-read="productPermissions"
    :item-value="type"
  >
    <template #deletable-chip-item="{ item }">
      <span>{{ item[type] }}</span>
    </template>
  </selectable-resource>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import { dataLoader } from '@/composable/loaders/dataLoader'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import ExpandableContent from '@/components/common/ExpandableContent.vue'
import SelectableResource from '@/components/common/selectables/SelectableResource.vue'
import SelectableTaxonomyTree from '@/components/common/selectables/SelectableTaxonomyTree.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type {
  Product,
  ProductGridRequest,
  ProductType,
  Taxonomy,
  TaxonomyGridRequest
} from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'CouponConditionSubsetInputs',

  components: { ExpandableContent, SelectableTaxonomyTree, SelectableResource },

  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    type: {
      type: String,
      required: true
    },
    selectSingle: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const api = useApi()
    const search = ref('')
    const values = ref<string[]>(props.value)
    const brands = ref<{ item: string }[]>([])

    const emitData = (): void => emit('input', values.value)
    watch(values, emitData, { deep: true })

    const { canRead: canReadProduct } = useCrudChecker('catalog\\product')
    const { canRead: canReadTaxonomy } = useCrudChecker('catalog\\taxonomy')

    const headers = {
      sku: [{ text: t('SKU'), value: 'sku' }],
      brand: [{ text: t('Brand'), value: 'brand' }],
      name: [{ text: t('Name'), value: 'name' }],
      taxonomy: [
        { text: t('Name'), value: 'name' },
        { text: t('Code'), value: 'code' }
      ]
    }

    const collection = collectionLoader()
    const data = dataLoader()

    const productCollectionResource = (params: ProductGridRequest): Promise<ResponseCollection<Product>> => {
      return api.catalog.products(params)
    }

    const taxonomyCollectionResource = (params: TaxonomyGridRequest): Promise<ResponseCollection<Taxonomy>> => {
      return api.catalog.taxonomies(params)
    }

    if (canReadProduct.value && props.type === 'brand') {
      data.loadData(() => api.catalog.yieldProducts({ yield: ['brands'] }))
      data.onSuccess(() => (brands.value = data.data.value.brands))
    }

    if (canReadProduct.value && props.type === 'type') {
      data.data.value = ['physical', 'virtual', 'digital'] as ProductType[]
    }

    if (canReadTaxonomy.value && props.type === 'taxonomy') {
      collection.loadCollection(() => taxonomyCollectionResource({ filter: { name: search.value } }))
    }

    const loading = computed(() => data.loading.value || collection.loading.value)
    const getData = computed(() => data.data.value || collection.data.value)

    return {
      values,
      headers,
      brands,
      loading,
      getData,
      productPermissions: canReadProduct,
      productCollectionResource,
      taxonomyCollectionResource
    }
  }
})
</script>
