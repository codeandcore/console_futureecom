<template>
  <v-expansion-panels v-model="panel" flat>
    <v-expansion-panel v-for="extra in extras" :key="extra.key">
      <v-expansion-panel-header class="pa-0 justify-start">
        <div class="d-flex flex-column">
          <span>
            {{ extra.name }}
            <span v-if="selected[extra.key].options.length" class="font-weight-light font-italic">
              : {{ selected[extra.key].options.map((item) => item.value).join(', ') }}
            </span>
          </span>
          <span v-if="!!extra.limit" class="text-caption grey--text">{{ $t('Max') }}: {{ extra.limit }}</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="py-0">
        <v-checkbox
          v-for="option in extra.options"
          :key="option.key"
          v-model="selected[extra.key].options"
          class="mt-0 mb-3"
          multiple
          :disabled="isDisabled(extra.key, option).value"
          :value="option"
          :label="$t(option.value)"
          hide-details
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { OrderableItemData } from '@futureecom/futureecom-js/dist/services/cart-service'
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import type { ComputedRef } from '@vue/composition-api'
import type { ProductExtraOptions, ProductExtras } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

interface MappedExtras {
  [key: string]: Pick<ProductExtras, 'name' | 'options' | 'limit'>
}

export default defineComponent({
  name: 'CartProductExtras',

  props: {
    value: {
      type: Object as PropType<Pick<OrderableItemData, 'extras'>>,
      default: undefined
    },
    extras: {
      type: Array as PropType<ProductExtras[]>,
      required: true
    }
  },

  setup(props, { emit }) {
    const panel = ref(0)

    const mapExtrasToObject = (): MappedExtras => {
      const extras: MappedExtras = {}

      props.extras.forEach((value) => {
        const { key, ...rest } = value
        extras[key] = { ...rest, options: [] }
      })

      return extras
    }

    const selected = ref<MappedExtras>(mapExtrasToObject())

    const getSelectedOptions = (key: string): ProductExtraOptions[] => selected.value[key].options

    const isDisabled = (key: string, option: ProductExtraOptions): ComputedRef<boolean> => {
      const extrasLimit = (props.extras.find((e) => e.key === key) || { limit: 0 }).limit
      const selectedOptions = getSelectedOptions(key)

      return computed((): boolean => {
        if (extrasLimit > 0 && selectedOptions.length >= extrasLimit) {
          return !selectedOptions.map((item) => item.value).includes(option.value)
        }

        return false
      })
    }

    watch(
      selected,
      () => {
        const extras = Object.keys(selected.value)
          .map((key) => {
            return !selected.value[key].options.length
              ? null
              : {
                  key,
                  name: selected.value[key].name,
                  options: selected.value[key].options || []
                }
          })
          .filter(Boolean)

        emit('input', { ...props.value, extras })
      },
      { deep: true }
    )

    return {
      isDisabled,
      selected,
      panel
    }
  }
})
</script>
