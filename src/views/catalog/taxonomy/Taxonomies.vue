<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Taxonomies') }}</span>
          <v-btn
            v-if="$canAny('manage,catalog\\taxonomy', 'create,catalog\\taxonomy')"
            data-cy="add-new-taxonomy"
            depressed
            color="primary"
            :to="{ name: 'taxonomy-create' }"
          >
            {{ $t('Add new taxonomy') }}
          </v-btn>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <taxonomy-action-force-mass-delete-dialog
          v-if="errors"
          v-model="errors"
          :items="selected"
          @onSuccess="onMassDeleteSuccess"
        />
        <resource-grid
          v-model="params"
          selectable-key="id"
          :options="options"
          :items="grid.data"
          hide-default-footer
          :selected-items.sync="selected"
          :show-select="canDelete"
          @onParamsChange="reloadCollection"
        >
          <template #item.name="{ item }">
            <router-link
              :is="canAccessTaxonomy ? 'router-link' : 'span'"
              :to="{ name: 'taxonomy-update', params: { id: item.id } }"
            >
              {{ item.name }}
            </router-link>
          </template>
          <template #item.products="{ item }">
            {{ item.products.length }}
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
              :to="{ name: 'taxonomy-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <taxonomy-action-delete v-if="canDelete" :value="item" icon @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
          <div class="d-flex flex-gap-8">
            <taxonomy-action-mass-delete
              v-if="canDelete"
              :items="selected"
              :disabled="grid.loading || !selected.length"
              @onSuccess="onMassDeleteSuccess"
              @onError="errors = $event"
            />
            <button-action
              :label="$t('Force delete')"
              :items="selected"
              text
              :disabled="grid.loading || !selected.length"
              @click="errors = { message: $t('Confirm force delete') }"
            />
          </div>
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
        <div class="d-flex flex-gap-8">
          <taxonomy-action-mass-delete
            v-if="canDelete"
            :items="selected"
            :disabled="grid.loading || !selected.length"
            @onSuccess="onMassDeleteSuccess"
            @onError="errors = $event"
          />
          <button-action
            :label="$t('Force delete')"
            :items="selected"
            text
            :disabled="grid.loading || !selected.length"
            @click="errors = { message: $t('Confirm force delete') }"
          />
        </div>
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { taxonomyFilters } from '@/libs/domains/catalog/taxonomy/filters'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import TaxonomyActionDelete from '@/components/domains/taxonomy/actions/TaxonomyActionDelete.vue'
import TaxonomyActionForceMassDeleteDialog from '@/components/domains/taxonomy/actions/TaxonomyActionForceMassDeleteDialog.vue'
import TaxonomyActionMassDelete from '@/components/domains/taxonomy/actions/TaxonomyActionMassDelete.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { Taxonomy, TaxonomyGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'Taxonomies',
  components: {
    TaxonomyActionForceMassDeleteDialog,
    ButtonAction,
    TaxonomyActionDelete,
    TablePagination,
    TaxonomyActionMassDelete,
    Scrollable,
    ResourceGrid,
    ScrollableResource
  },

  setup(props, { root }) {
    const errors = ref<MassDeleteError>()
    const grid = reactive<Grid>(gridTemplate())
    const selected = ref<Taxonomy[]>([])

    const api = useApi()

    const params = computed<TaxonomyGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onMassDeleteSuccess = () => onDeleteSuccess(selected.value.length)

    const reloadCollection = (gridParams?: TaxonomyGridRequest, deletedCount = 0): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      setTimeout(() => {
        api.catalog
          .taxonomies({ ...params.value, include: ['products'] })
          .then((value) => {
            grid.data = [...value.data]
            grid.meta = value.meta
            selected.value = []
          })
          .finally(() => (grid.loading = false))
      }, 1500 * deletedCount)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Sort order'), value: 'order' },
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Code'), value: 'code' },
        { text: ctx.$t('Product count'), value: 'products', sortable: false },
        { text: ctx.$t('Created At'), value: 'created_at' }
      ]

      if (canAccessTaxonomy.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = taxonomyFilters.map((filter) => ({
        ...filter,
        label: ctx.$t(filter.label)
      }))

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const canAccessTaxonomy = computed((ctx) => {
      return ctx.$canAny('manage,catalog\\taxonomy', 'delete,catalog\\taxonomy', 'update,catalog\\taxonomy').value
    })

    const canDelete = computed((ctx) => ctx.$canAny('delete,catalog\\taxonomy', 'manage,catalog\\taxonomy').value)

    return {
      params,
      errors,
      reloadCollection,
      options,
      grid,
      selected,
      onDeleteSuccess,
      onMassDeleteSuccess,
      canAccessTaxonomy,
      canDelete
    }
  }
})
</script>
