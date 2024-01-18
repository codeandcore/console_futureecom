<template>
  <v-dialog :value="showDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <slot name="dialog-header">
          <span v-if="hasErrorItems">{{ $t("Some items couldn't be deleted") }}</span>
          <span v-else-if="value">{{ value.message }}</span>
        </slot>
        <v-btn icon @click="clearErrors">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-alert type="error" class="my-4" dense>
          <span>{{ $t('Are you sure? Force delete bypasses restrictions, which can break related items.') }}</span>
        </v-alert>
        <v-data-table
          v-if="hasErrorItems"
          v-model="selectedToForceDelete"
          :loading="loading"
          :headers="headers"
          item-key="id"
          :items="failedItems"
          show-select
          :items-per-page="-1"
          hide-default-footer
        >
          <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
          </template>
        </v-data-table>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex justify-space-between">
        <v-btn depressed :disabled="loading" @click="clearErrors">
          {{ $t('Cancel') }}
        </v-btn>
        <button-action
          :loading="loading"
          :disabled="!isDeleteDisabled && !!hasErrorItems"
          depressed
          :label="$t('Force Delete')"
          :items="selectedToForceDelete"
          color="primary"
          @click="$emit('delete', selectedIds)"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import ButtonAction from './ButtonAction.vue'
import type { GridHeader } from '@/types/DataTableGrid'
import type { MassDeleteError } from '@/types/MassDeleteError'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ForceMassDeleteDialog',
  components: { ButtonAction },

  props: {
    value: {
      type: Object as PropType<MassDeleteError>,
      default: undefined
    },
    items: {
      type: Array as PropType<{ id: string }[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array as PropType<GridHeader[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const selectedToForceDelete = ref<
      {
        id: string
      }[]
    >(Object.keys(props.value?.errors || {}).length ? [] : props.items)

    const showDialog = computed(() => !!props.value?.message)
    const hasErrorItems = computed(() => Object.keys(props.value?.errors || {}).length)
    const selectedIds = computed(() => selectedToForceDelete.value.map((item) => item.id))
    const isDeleteDisabled = computed(() => !!selectedIds.value.length)

    const clearErrors = () => emit('input', undefined)

    const failedItems = computed(() => {
      if (!props.value) {
        return []
      }

      return props.items.reduce((prev: { id: string }[], current) => {
        if (!props.value.errors) {
          return prev
        }

        const { id } = current
        return id in props.value.errors ? [...prev, { ...current, message: props.value.errors[id].message }] : prev
      }, [])
    })

    return {
      showDialog,
      hasErrorItems,
      clearErrors,
      isDeleteDisabled,
      failedItems,
      selectedToForceDelete,
      selectedIds
    }
  }
})
</script>
