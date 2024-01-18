<template>
  <v-slide-y-reverse-transition
    mode="out-in"
    group
    class="d-flex flex-gap-8 flex-wrap align-center"
    data-cy="deletable-chips"
  >
    <v-chip
      v-for="(item, index) in sortedChips"
      :key="`deletable-chip-${index}`"
      class="d-flex flex-column"
      v-bind="$attrs"
      :color="item.error ? 'red' : undefined"
      :text-color="item.error ? 'white' : undefined"
      :large="!!item.error"
      label
      data-cy="deletable-chips-item"
    >
      <span class="d-flex flex-column">
        <slot v-bind="{ item, index }">{{ item }}</slot>
        <span v-if="item.error" class="text-caption" data-cy="deletable-chips-error">{{ item.error }}</span>
      </span>
      <template v-if="showDeleteIcon">
        <v-divider vertical class="mx-2" />
        <v-icon data-cy="deletable-chips-delete-icon" @click="deleteItem(item.chipIndex)">close</v-icon>
      </template>
    </v-chip>
    <v-btn
      v-if="value.length > 3"
      key="chip-button"
      small
      color="primary"
      depressed
      class="ma-2"
      data-cy="deletable-chips-show-more"
      @click="showMore = !showMore"
    >
      {{ showMoreButtonText }}
    </v-btn>
  </v-slide-y-reverse-transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'DeletableChips',

  props: {
    value: {
      type: Array as PropType<any[]>,
      required: true
    },
    showDeleteIcon: {
      type: Boolean,
      default: true
    },
    maxChipCount: {
      type: Number,
      default: 3
    },
    errors: {
      type: Object as PropType<{ [key: number]: string }>,
      default: () => ({})
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const showMore = ref(false)

    const chips = computed((): { [key: string]: unknown; error: string; chipIndex: number }[] => {
      return props.value.map((item, chipIndex) => ({
        ...item,
        error: props.errors[chipIndex] || '',
        chipIndex
      }))
    })

    const sortedChips = computed(() => {
      const errored = [...chips.value].filter((item) => item.error).sort((a, b) => (a.chipIndex > b.chipIndex ? 1 : -1))
      const valid = [...chips.value].filter((item) => !item.error).sort((a, b) => (a.chipIndex > b.chipIndex ? 1 : -1))

      const sorted = [...errored, ...valid]
      return showMore.value || sorted.length < 3 ? sorted : sorted.slice(0, props.maxChipCount)
    })

    const showMoreButtonText = computed(() => {
      if (showMore.value) {
        return t('Show less')
      }
      return `${t('Show more')} (+${props.value.length - props.maxChipCount})`
    })

    const deleteItem = (chipIndex: number): void => {
      const array = chips.value
        .filter((chipItem) => chipItem.chipIndex !== chipIndex)
        .map(({ error, chipIndex, ...rest }) => ({ ...rest }))

      emit('onDelete', array)
    }

    return {
      sortedChips,
      showMore,
      showMoreButtonText,
      deleteItem
    }
  }
})
</script>
