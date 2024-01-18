<template>
  <grid-layout
    v-bind="{ grid, params, options, title: $t('Products') }"
    :grid-props="{ 'selectable-key': 'id', 'show-select': canDelete }"
    :selected-items.sync="selected"
    @paramsChanged="reloadCollection"
  >
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-product" depressed color="primary" :to="{ name: 'product-create' }">
        {{ $t('Add new product') }}
      </v-btn>
    </template>
    <template #scrollable.content.top>
      <product-action-force-mass-delete-dialog
        v-if="errors"
        v-model="errors"
        :items="selected"
        @success="onMassDeleteSuccess"
      />
      <div class="my-4 d-flex flex-gap-24 justify-end">
        <product-import small @onSuccess="reloadCollection(params)" />
        <product-export small />
      </div>
      <v-divider />
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'product-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.image_url="{ item }">
      <image-zoom>
        <template #thumbnail>
          <product-image-preview :value="item.image_url" height="40" width="40" class="my-3 rounded-lg" />
        </template>
        <template #zoom>
          <product-image-preview :value="item.image_url" max-width="300" />
        </template>
      </image-zoom>
    </template>
    <template #item.sku="{ item }">
      <router-link :to="{ name: 'product-update', params: { id: item.id } }">
        {{ item.sku }}
      </router-link>
    </template>
    <template #item.price.amount="{ item }">
      <money-preview :value="item.price" />
    </template>
    <template #item.gross_price.amount="{ item }">
      <money-preview :value="item.gross_price" />
    </template>
    <template #item.sale_price.amount="{ item }">
      <money-preview :value="item.sale_price" />
    </template>
    <template #item.gross_sale_price.amount="{ item }">
      <money-preview :value="item.gross_sale_price" />
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'product-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <product-action-delete :value="item" icon @success="onDeleteSuccess" />
    </template>
    <template #grid.footer.actions>
      <div>
        <product-action-mass-delete
          v-if="canDelete"
          :items="selected"
          :disabled="grid.loading || !selected.length"
          @success="onMassDeleteSuccess"
          @error="errors = $event"
        />
        <button-action
          :label="$t('Force delete')"
          :items="selected"
          text
          :disabled="grid.loading || !selected.length"
          @click="errors = { message: $t('Confirm force delete') }"
        />
      </div>
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { productFilters } from '@/libs/domains/catalog/products/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useSettings } from '@/composable/repositories/useSettings'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import ImageZoom from '@/components/common/ImageZoom.vue'
import MoneyPreview from '@/components/common/MoneyPreview.vue'
import ProductActionDelete from '@/components/domains/products/actions/ProductActionDelete.vue'
import ProductActionForceMassDeleteDialog from '@/components/domains/products/actions/ProductActionForceMassDeleteDialog.vue'
import ProductActionMassDelete from '@/components/domains/products/actions/ProductActionMassDelete.vue'
import ProductExport from '@/components/domains/products/ProductExport.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import ProductImport from '@/components/domains/products/ProductImport.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { Product, ProductGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'Products',
  components: {
    MoneyPreview,
    GridLayout,
    ProductActionForceMassDeleteDialog,
    ImageZoom,
    ProductImagePreview,
    ButtonAction,
    ProductActionDelete,
    ProductActionMassDelete,
    ProductImport,
    ProductExport
  },

  setup() {
    const { t } = useI18n()

    const errors = ref<MassDeleteError>()
    const grid = reactive<Grid>(gridTemplate())
    const selected = ref<Product[]>([])

    const { getStoreSetting } = useSettings()
    const api = useApi()

    const params = useQueryFromUrl<ProductGridRequest>({ sort: ['-created_at'] })

    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\product')

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onMassDeleteSuccess = () => onDeleteSuccess(selected.value.length)

    const reloadCollection = (gridParams?: ProductGridRequest, deletedCount = 0): void => {
      params.value = { ...params.value, ...gridParams }

      setTimeout(() => {
        api.catalog
          .products(params.value)
          .then((value) => {
            grid.data = [...value.data]
            grid.meta = value.meta
            selected.value = []
          })
          .finally(() => (grid.loading = false))
      }, 1500 * deletedCount)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const hasVat = getStoreSetting('general.taxes.type') === 'vat'
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Sort order'), value: 'order' },
        { text: t('Name'), value: 'name' },
        { text: t('Image'), value: 'image_url', sortable: false },
        { text: t('SKU'), value: 'sku' },
        { text: t('Class'), value: 'classification' },
        { text: t('Price'), value: 'price.amount' }
      ]
      if (hasVat) {
        headers.push({ text: t('Gross Price'), value: 'gross_price.amount' })
      }

      headers.push({ text: t('Sale Price'), value: 'sale_price.amount' })

      if (hasVat) {
        headers.push({ text: t('Gross Sale Price'), value: 'gross_sale_price.amount' })
      }

      headers.push(
        { text: t('Quantity'), value: 'inventory.quantity' },
        { text: t('Created At'), value: 'created_at' },
        { text: t('Updated At'), value: 'updated_at' }
      )

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = productFilters.map((filter) => ({
        ...filter,
        label: ctx.$t(filter.label)
      }))

      return {
        headers,
        filters
      }
    })

    return {
      params,
      errors,
      options,
      grid,
      selected,
      canCreate,
      canDelete,
      reloadCollection,
      onDeleteSuccess,
      onMassDeleteSuccess
    }
  }
})
</script>
