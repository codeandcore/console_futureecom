<template>
  <div class="d-flex flex-column">
    <rule-validator :value="val.components" :rules="validator.rules.components" class="d-flex flex-column mx-3" />
    <v-data-table
      v-if="val.components.length"
      :items="val.components"
      :headers="selectedComponentsHeaders"
      hide-default-footer
      item-key="key"
      :loading="loading"
    >
      <template #item.sku="{ item }">
        <router-link :to="{ name: 'product-update', params: { id: item.id } }" class="text-no-wrap">
          {{ item.sku }}
        </router-link>
      </template>
      <template #item.quantity="{ item }">
        <v-text-field
          v-if="!loading"
          v-model.number="item.quantity"
          v-mask="$format.mask.quantityMask"
          :rules="validator.rules.quantity"
          outlined
          hide-details="auto"
          class="mx-1 my-5"
          dense
        />
      </template>
      <template #item.actions="{ item }">
        <v-btn v-if="hasItems && !loading" icon @click="removeComponent(item.key)">
          <v-icon>clear</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-expansion-panels v-model="openAddComponentPanel">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t('Add Components') }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <data-table-resource
            resource="products"
            :headers="productsHeaders"
            item-value="id"
            chip-text="name"
            read-ability="read,catalog\product"
            :filters="{ classification: 'common' }"
          >
            <template #item.actions="{ item }">
              <v-btn depressed color="primary" icon @click="addComponent(item)">
                <v-icon>playlist_add</v-icon>
              </v-btn>
            </template>
          </data-table-resource>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { v4 as uuid4 } from 'uuid'
import DataTableResource from '@/components/common/selectables/DataTableResource.vue'
import RuleValidator from '@/components/common/RuleValidator.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { Product, ProductBundle, ProductComponent } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { ProductValidator } from '@/composable/resources/useProduct'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductComponents',
  components: { DataTableResource, RuleValidator },

  props: {
    value: {
      type: Object as PropType<ProductBundle>,
      required: true
    },
    validator: {
      type: Object as PropType<ProductValidator>,
      required: true
    }
  },

  setup(props, { emit }) {
    const api = useApi()
    const openAddComponentPanel = ref<number | undefined>(undefined)
    const loader = collectionLoader()

    const val = reactive({
      components: props.value.components || []
    })

    if (val.components.length > 0) {
      loader.loadCollection(() => api.catalog.products({ filter: { id: val.components.map((item) => item.id) } }))
      loader.onSuccess(() => {
        val.components = val.components
          .map((item: ProductComponent) => {
            const found = (loader.data.value as Product[]).find((loaderItem) => loaderItem.id === item.id)
            return found ? { ...item, ...found } : null
          })
          .filter(Boolean) as ProductComponent[]
      })
    }

    const hasItems = computed(() => (val.components || []).length > 1)

    const productsHeaders = computed((ctx) => {
      return [
        { text: ctx.$t('Name'), sortable: false, value: 'name' },
        { text: ctx.$t('SKU'), sortable: false, value: 'sku' },
        { text: ctx.$t('Inventory quantity'), sortable: false, value: 'inventory.quantity', width: '25%' },
        { text: '', value: 'actions', sortable: false }
      ]
    })

    const selectedComponentsHeaders = computed((ctx) => {
      return [
        ...productsHeaders.value.slice(0, 3),
        { text: ctx.$t('Bundle quantity'), sortable: false, value: 'quantity', width: '25%', class: 'text-xs-center' },
        { text: '', value: 'actions', sortable: false }
      ]
    })

    watch(val, () => {
      emit('input', {
        ...props.value,
        components: val.components.map(({ id, key, quantity }) => ({ id, key, quantity }))
      })
    })

    const addComponent = (item: Product): void => {
      val.components = [...val.components, { ...item, key: uuid4().toString(), quantity: 1 }]
    }

    const removeComponent = (key: string): void => {
      val.components = val.components.filter((item) => item.key !== key)
    }

    return {
      openAddComponentPanel,
      val,
      selectedComponentsHeaders,
      productsHeaders,
      loading: loader.loading,
      hasItems,
      addComponent,
      removeComponent
    }
  }
})
</script>
