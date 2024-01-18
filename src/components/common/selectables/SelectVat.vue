<template>
  <v-select
    v-bind="$attrs"
    :value="vat"
    data-cy="select-vat"
    :label="$t('VAT')"
    :items="data"
    item-value="id"
    return-object
    outlined
    :multiple="false"
    :loading="loading"
    clearable
    @input="onSelect"
  >
    <template #selection="{ item }">
      <span data-cy="selected-vat">{{ getVatName(item).value }}</span>
    </template>
    <template #item="{ item }">
      <span data-cy="item-vat">{{ getVatName(item).value }}</span>
    </template>
  </v-select>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import movePointerPosition from '@/libs/movePointerPosition'
import useApi from '@/composable/useApi'
import type { BaseVat } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectVat',

  props: {
    value: {
      type: Object as PropType<BaseVat | undefined>,
      default: undefined
    },
    items: {
      type: Array as PropType<BaseVat[]>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const loading = ref(false)
    const data = ref<BaseVat[]>(props.items || [])

    if (!props.items) {
      loading.value = true
      useApi()
        .taxes.vatRates({ perPage: -1 })
        .then((val) => (data.value = val.data))
        .finally(() => (loading.value = false))
    }

    const vat = computed({
      get: () => props.value,
      set: (vat: BaseVat | undefined) => emit('input', vat)
    })

    const onSelect = (val: BaseVat | string) => (vat.value = typeof val === 'string' ? undefined : val)

    const getVatName = (item: BaseVat) => {
      return computed((): string => `${item.name} (${movePointerPosition(item.value, 2)}%)`)
    }

    return {
      onSelect,
      vat,
      getVatName,
      data,
      loading
    }
  }
})
</script>
