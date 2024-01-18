<template>
  <div class="d-flex flex-column flex-gap-16" data-cy="selectable-medias">
    <div v-if="canRead">
      <v-text-field
        v-if="searchKey"
        v-model="searchVal"
        outlined
        :label="$t(`Search by ${searchKey}`)"
        append-icon="search"
        append-outer-icon="filter_alt"
        hide-details
        data-cy="selectable-medias-search-name"
        @click:append-outer="isFilterOpen = true"
      />

      <filters-chips
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-medias-filter-chips"
        @input="reloadCollection"
      />

      <v-divider v-if="currentItem" class="my-4" />
      <div v-if="currentItem" class="d-flex flex-gap-32 flex-wrap">
        <image-upload-preview v-model="currentItem.secure_url" :show-delete="false" :preview-size="60" />
        <media-data
          :value="currentItem"
          class="text-caption grey--text text--darken-2 d-flex flex-gap-32 flex-wrap"
          include-timestamps
        />
      </div>

      <filters-grid-drawer
        :open.sync="isFilterOpen"
        :value="currentParams"
        :definitions="filters"
        data-cy="selectable-medias-grid-drawer"
        @input="reloadCollection"
      />
    </div>

    <v-divider />

    <template v-if="canRead">
      <div data-cy="selectable-medias-grid" class="d-flex flex-gap-16">
        <div class="d-flex flex-column flex-gap-16 flex-grow-1">
          <div class="d-flex flex-column">
            <div v-if="grid.loading" class="d-flex align-center justify-center">
              <v-progress-circular size="32" color="primary" indeterminate />
            </div>

            <div v-else-if="grid.data.length" class="d-flex flex-wrap flex-gap-8">
              <selectable-card
                v-for="media in grid.data"
                :key="media.id"
                width="80px"
                height="80px"
                dense
                :class="{ 'v-card__active': currentItem && currentItem.id === media.id }"
                @onSelect="onItemSelect(media)"
              >
                <v-img :src="media.secure_url" height="80" width="80" />
              </selectable-card>
            </div>
          </div>

          <v-divider />

          <div class="d-flex justify-end">
            <div class="col-5 pa-0 ma-0">
              <table-pagination v-model="currentParams" class="" :meta="grid.meta" @input="reloadCollection" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { combineFilters } from '@/libs/tables/filters'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { debouncedWatch } from '@vueuse/core'
import { gridTemplate } from '@/libs/tables/grid'
import { mediaFilters } from '@/libs/domains/cms/media/filters'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'
import FiltersGridDrawer from '@/components/tables/filters/FiltersGridDrawer.vue'
import ImageUploadPreview from '@/components/common/imageUpload/ImageUploadPreview.vue'
import MediaData from '@/components/domains/cms/media/MediaData.vue'
import SelectableCard from '@/components/common/selectables/SelectableCard.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { FilterDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { Media, MediaFilter, MediaGridRequest } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectableMedia',

  components: { ImageUploadPreview, MediaData, TablePagination, SelectableCard, FiltersGridDrawer, FiltersChips },

  props: {
    value: {
      type: Object as PropType<Media>,
      default: undefined
    },
    searchKey: {
      type: [] as PropType<MediaFilter>,
      default: 'name'
    },
    gridOptions: {
      type: Object as PropType<ResourceGridOptions<MediaFilter>>,
      default: undefined
    },
    requestOptions: {
      type: Object as PropType<MediaGridRequest>,
      default: undefined
    }
  },

  emits: {
    input: (_: Media) => true
  },

  setup(props, { emit }) {
    const { canRead } = useCrudChecker('cms\\media')

    const { t } = useI18n()

    const searchVal = ref('')
    const currentParams = ref<MediaGridRequest>()
    const isFilterOpen = ref(false)

    const currentItem = ref<Media>(props.value)
    const grid = reactive<Grid>({ ...gridTemplate() })

    const api = useApi()

    const filters = computed((): FilterDefinition<MediaFilter>[] => {
      const searchFilter: FilterTextDefinition<MediaFilter> = { code: props.searchKey, label: '', type: 'text' }
      const combined = combineFilters<MediaFilter>(mediaFilters, props.gridOptions?.filters || [], [searchFilter])
      return combined.map((filter) => ({ ...filter, label: t(`${filter.label}`) }))
    })

    const reloadCollection = (params?: MediaGridRequest) => {
      currentParams.value = {
        ...params,
        ...props.requestOptions,
        filter: { ...params?.filter, ...props.requestOptions?.filter }
      }

      grid.loading = true

      api.cms
        .medias(currentParams.value)
        .then((val) => {
          grid.data = val.data
          grid.meta = val.meta
        })
        .finally(() => (grid.loading = false))
    }

    const onItemSelect = (item: Media) => {
      currentItem.value = item
      emit('input', currentItem.value)
    }

    debouncedWatch(
      searchVal,
      () => {
        const params = {
          ...currentParams.value,
          filter: { ...currentParams.value?.filter, [props.searchKey]: searchVal.value || undefined }
        }

        reloadCollection(params)
      },
      { debounce: 700 }
    )

    if (canRead.value) {
      reloadCollection({ perPage: 10 })
    }

    return {
      canRead,
      searchVal,
      currentParams,
      currentItem,
      grid,
      filters,
      isFilterOpen,
      onItemSelect,
      reloadCollection
    }
  }
})
</script>
