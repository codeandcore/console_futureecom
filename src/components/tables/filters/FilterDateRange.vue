<template>
  <v-menu v-model="openMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
    <template #activator="{ on }">
      <div data-cy="filter-date-range-input" v-on="on">
        <slot name="before" />
        <v-text-field
          :value="renderedValue"
          dense
          outlined
          append-icon="calendar_month"
          readonly
          v-bind="$attrs"
          hide-details="auto"
          clearable
          @click:clear="$emit('input', '')"
        />
        <slot name="after" />
      </div>
    </template>

    <transition mode="out-in">
      <v-card v-if="openMenu" data-cy="filter-date-range-date-picker">
        <v-card-text>
          <v-date-picker
            v-model="selectedRange"
            data-cy="filter-date-range-picker"
            no-title
            scrollable
            range
            show-adjacent-months
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-space-around">
          <div>
            <v-btn depressed data-cy="filter-date-range-button-cancel" @click="openMenu = false">
              {{ $t('Cancel') }}
            </v-btn>
          </div>
          <div>
            <v-btn depressed color="primary" data-cy="filter-date-range-button-apply" @click="emitRange">
              {{ $t('Apply') }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </transition>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'
import type { FilterRange } from '@/types/FilterDefinitions'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterDateRange',

  props: {
    value: {
      type: Object as PropType<FilterRange>,
      default: () => ({ gte: '', lte: '' })
    }
  },

  setup(props, { emit }) {
    const openMenu = ref(false)
    const selectedRange = ref<string[]>([])

    const getRenderedValue = (): string => Object.values(props.value).filter(Boolean).join(', ')
    const renderedValue = ref(getRenderedValue())

    watch(
      () => props.value,
      () => (renderedValue.value = getRenderedValue()),
      { deep: true }
    )

    const emitRange = () => {
      const data = { gte: selectedRange.value[0], lte: selectedRange.value[1] }
      emit('input', data.lte || data.gte ? data : '')
      openMenu.value = false
    }

    return {
      openMenu,
      renderedValue,
      emitRange,
      selectedRange
    }
  }
})
</script>
