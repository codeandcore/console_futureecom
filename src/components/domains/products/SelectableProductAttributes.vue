<template>
  <v-container>
    <template v-for="item in items">
      <v-row :key="item.value" align="center" justify="space-between">
        <v-col class="py-0">
          <v-checkbox
            v-model="selectedAttributes"
            :indeterminate="
              item.children &&
              item.children.some((i) => selectedAttributes.includes(i.value)) &&
              !selectedAttributes.includes(item.value)
            "
            :label="$t(item.text)"
            :value="item.value"
            hide-details="auto"
            @click="() => item.children && selectNestedItem(item)"
          />
        </v-col>
        <v-col cols="2" class="py-0">
          <v-row justify="end">
            <v-btn v-if="item.children" class="mx-2 mt-4" icon depressed color="primary" @click="expand(item.value)">
              <v-icon>expand_more</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-slide-y-transition :key="`expanded-${item.value}`" mode="out-in">
        <div v-if="expandedAttributes.includes(item.value)" class="my-4">
          <v-row v-for="child in item.children" :key="child.value" align="center" justify="space-between" class="mx-4">
            <v-col class="py-0">
              <v-checkbox
                v-model="selectedAttributes"
                :label="$t(child.text)"
                :value="child.value"
                hide-details="auto"
                @click="() => item.children && selectNestedItem(item, child)"
              />
            </v-col>
          </v-row>
        </div>
      </v-slide-y-transition>
    </template>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api'

interface SelectableAttributes {
  text: string
  value: string
  children?: SelectableAttributes[]
}

export default defineComponent({
  name: 'SelectableProductAttributes',

  props: {
    items: {
      type: Array as () => SelectableAttributes[],
      required: true
    }
  },

  setup(props, { emit }) {
    const selectedAttributes = ref<string[]>([])
    const expandedAttributes = ref<string[]>([])

    const expand = (value: string): void => {
      const isIncluded = expandedAttributes.value.includes(value)

      expandedAttributes.value = isIncluded
        ? expandedAttributes.value.filter((item: string) => item !== value)
        : (expandedAttributes.value = [value, ...expandedAttributes.value])
    }

    const selectNestedItem = (parent: SelectableAttributes, child?: SelectableAttributes): void => {
      const children = parent.children || []

      if (child) {
        const hasAllSelected = children.every((item) => selectedAttributes.value.includes(item.value))

        selectedAttributes.value = hasAllSelected
          ? [...new Set([parent.value, ...selectedAttributes.value])]
          : selectedAttributes.value.filter((item) => item !== parent.value)

        return
      }

      const selectedParent = children.every((i) => selectedAttributes.value.includes(i.value))

      selectedAttributes.value = selectedParent
        ? selectedAttributes.value.filter((item) => !item.includes(parent.value))
        : [...new Set([...children.map((item: SelectableAttributes) => item.value), ...selectedAttributes.value])]
    }

    watch(selectedAttributes, () => {
      emit('input', selectedAttributes.value)
    })

    return {
      expandedAttributes,
      selectedAttributes,
      expand,
      selectNestedItem
    }
  }
})
</script>
