<template>
  <grid-layout
    v-bind="{ grid, params, options, title: $t('Categories'), gridProps: { showSelect: canDelete } }"
    :selected-items.sync="selected"
    @paramsChanged="reloadCollection"
  >
    <template #actions>
      <v-btn v-if="canCreate" data-cy="add-new-category" depressed color="primary" :to="{ name: 'category-create' }">
        {{ $t('Add new category') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link
        :is="canUpdate || canDelete ? 'router-link' : 'span'"
        :to="{ name: 'category-update', params: { id: item.id } }"
      >
        {{ item.name }}
      </router-link>
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'category-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <category-action-delete icon :value="item" @onSuccess="onDeleteSuccess" />
    </template>
    <template v-if="canDelete" #grid.footer.actions>
      <category-action-force-mass-delete-dialog
        v-if="errors"
        v-model="errors"
        :items="selected"
        @onSuccess="onMassDeleteSuccess"
      />
      <div class="d-flex flex-gap-8">
        <category-action-mass-delete
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
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { categoryFilters } from '@/libs/domains/catalog/categories/filters'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CategoryActionDelete from '@/components/domains/catalog/category/actions/CategoryActionDelete.vue'
import CategoryActionForceMassDeleteDialog from '@/components/domains/catalog/category/actions/CategoryActionForceMassDeleteDialog.vue'
import CategoryActionMassDelete from '@/components/domains/catalog/category/actions/CategoryActionMassDelete.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { Category, CategoryGridRequest } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { MassDeleteError } from '@/types/MassDeleteError'

export default defineComponent({
  name: 'Categories',

  components: {
    CategoryActionMassDelete,
    CategoryActionForceMassDeleteDialog,
    CategoryActionDelete,
    ButtonAction,
    GridLayout
  },

  setup() {
    const params = useQueryFromUrl<CategoryGridRequest>({ sort: ['-created_at'] })
    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\category')

    const errors = ref<MassDeleteError>()
    const grid = reactive<Grid>(gridTemplate())
    const selected = ref<Category[]>([])

    const api = useApi()

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onMassDeleteSuccess = () => onDeleteSuccess(selected.value.length)

    const reloadCollection = (gridParams?: CategoryGridRequest, deletedCount = 0): void => {
      params.value = { ...params.value, ...gridParams }

      setTimeout(() => {
        api.catalog
          .categories(params.value)
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
        { text: ctx.$t('Sort Order'), value: 'order' },
        { text: ctx.$t('Name'), value: 'name' },
        { text: ctx.$t('Code'), value: 'code' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters = categoryFilters.map((filter) => ({
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
      reloadCollection,
      onDeleteSuccess,
      onMassDeleteSuccess,
      options,
      grid,
      canCreate,
      canUpdate,
      canDelete,
      errors,
      selected
    }
  }
})
</script>
