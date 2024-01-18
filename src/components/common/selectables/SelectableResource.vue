<template>
  <div>
    <v-card-title class="px-0">
      <slot name="search">
        <v-row>
          <v-col :cols="!canRead ? '10' : '12'">
            <v-text-field
              v-model="search"
              dense
              outlined
              append-icon="mdi-magnify"
              :label="$t(label)"
              single-line
              hide-details
              clearable
              :disabled="!canRead"
            />
          </v-col>
          <v-col v-if="!canRead && !loadingItems" cols="1">
            <no-permissions-tooltip class="mx-3" />
          </v-col>
        </v-row>
      </slot>
    </v-card-title>
    <deletable-chips v-if="showChips" v-model="selected" @onDelete="onDelete">
      <template #default="{ item }">
        <slot name="deletable-chip-item" :item="item" />
      </template>
    </deletable-chips>
    <slot name="table-top" />
    <v-data-table
      v-if="canRead"
      v-model="selected"
      :search="search"
      :headers="headers"
      :items="data"
      :loading="loadingItems"
      :server-items-length="metadata.total"
      :single-select="singleSelect"
      show-select
      :item-key="itemValue"
      @input="onInput"
      @update:options="reloadCollection"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useSelectableFilterCollection } from '@/composable/table/useSelectableFilterCollection'
import DeletableChips from '@/components/common/DeletableChips.vue'
import NoPermissionsTooltip from '@/components/common/NoPermissionsTooltip.vue'
import collectionLoader from '@/composable/loaders/collectionLoader'

export default defineComponent({
  name: 'SelectableResource',
  components: { NoPermissionsTooltip, DeletableChips },
  props: {
    label: {
      type: String,
      default: 'Search by name'
    },
    searchCriteria: {
      type: String,
      default: 'name'
    },
    items: {
      type: Array as <T>() => T[],
      default: () => []
    },
    selectIds: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Function
    },
    resource: {
      type: Function,
      required: true
    },
    headers: {
      type: Array,
      default: (): any => []
    },
    canRead: {
      type: Boolean,
      default: true
    },
    showChips: {
      type: Boolean,
      default: true
    },
    singleSelect: {
      type: Boolean,
      default: false
    },
    itemValue: {
      type: String,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const search = ref('')

    const collection = collectionLoader()
    const mapToSelected = () => {
      if (props.itemValue) {
        return (props.items || []).map((item: any) => ({ [props.itemValue]: item[props.itemValue] ?? item }))
      }
      return props.items
    }
    const selected = ref<any[]>(mapToSelected())

    const onDelete = (items: []): void => {
      selected.value = items
    }

    const { reloadCollection } = useSelectableFilterCollection({
      collection,
      search,
      searchCriteria: props.searchCriteria,
      reloadFn: props.resource,
      filterFn: props.filter
    })

    const onInput = (items: any[]): void => {
      if (props.selectIds) {
        emit('input', items.map((item) => item?.id).filter(Boolean))
        return
      }

      if (props.itemValue) {
        emit(
          'input',
          items.map((item) => item[props.itemValue])
        )
        return
      }
      emit('input', items)
    }

    return {
      search,
      selected,
      metadata: collection.metadata,
      data: collection.data,
      loadingItems: collection.loading,
      reloadCollection,
      onDelete,
      onInput
    }
  }
})
</script>
