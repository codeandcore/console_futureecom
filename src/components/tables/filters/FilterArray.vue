<template>
  <v-combobox
    v-model="filter"
    v-bind="$attrs"
    :items="items"
    :search-input.sync="searchVal"
    hide-details="auto"
    clearable
    dense
    outlined
    deletable-chips
    chips
    small-chips
    :append-icon="comboboxIcon"
    item-text="text"
    item-value="value"
    :return-object="false"
    @update:search-input="debouncedSearch"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { isObject } from '@/libs/objects'
import { useDebounceFn } from '@vueuse/core'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterArray',

  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    items: {
      type: Array as PropType<({ text: string; value: string } | string)[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const searchVal = ref()

    const comboboxIcon = computed(() => (props.items.length > 0 ? undefined : ''))

    const filter = computed({
      get: () => props.value,
      set: (value: string[]) => emit('input', value.length ? value : null)
    })

    const applyValue = (val: string | null) => {
      const foundItem = props.items.find((item) => isObject(item) && item.text.toLowerCase() === `${val}`.toLowerCase())

      if (!val || (props.items.length && !foundItem)) {
        return
      }

      searchVal.value = ''
      filter.value = [...filter.value, isObject(foundItem) ? foundItem.value : val]
    }

    const debouncedSearch = useDebounceFn(applyValue, 700)

    return {
      filter,
      searchVal,
      debouncedSearch,
      comboboxIcon
    }
  }
})
</script>
