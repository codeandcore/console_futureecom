<template>
  <v-combobox
    v-bind="$attrs"
    v-model.trim="model"
    :items="items"
    outlined
    :item-text="(item) => capitalizeEachWord(replaceDotsToSpace(item.code))"
    multiple
    item-value="code"
    :return-object="false"
    hide-details="auto"
    @input="$emit('input', model)"
  >
    <template #selection="{ item, selected }">
      <v-slide-y-reverse-transition mode="out-in">
        <v-chip v-if="items" class="text-capitalize" :value="selected" label close @click:close="removeItem(item)">
          {{ replaceDotsToSpace(item) }}
        </v-chip>
      </v-slide-y-reverse-transition>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import type { NotificationTemplate } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'TemplatesCombobox',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array as PropType<NotificationTemplate[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const model = ref(props.value)
    const replaceDotsToSpace = (str: string): string => str.replaceAll('.', ' ')
    const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
    const capitalizeEachWord = (str: string): string =>
      str
        .split(' ')
        .map((word) => capitalize(word))
        .join(' ')

    const removeItem = (item: string): void => {
      model.value = model.value.filter((code) => code !== item)
      emit('input', model.value)
    }

    return {
      model,
      removeItem,
      replaceDotsToSpace,
      capitalizeEachWord
    }
  }
})
</script>
