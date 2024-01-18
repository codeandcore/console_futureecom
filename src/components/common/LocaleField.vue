<template>
  <div>
    <v-text-field
      :key="lastSelected"
      v-model="locale"
      :label="`${$t('Locale')} (xx-XX)`"
      v-bind="$attrs"
      outlined
      hide-details="auto"
      maxlength="5"
    />
    <div v-if="suggestLocales" class="my-2 d-flex align-center flex-gap-8">
      <span class="grey--text text-caption">{{ $t('Suggested') }}:</span>
      <v-chip-group class="flex-gap-8" mandatory>
        <v-chip
          v-for="(suggested, index) in suggestedLocales"
          :key="`${index}-${suggested}`"
          @click="selectLocale(suggested, index)"
        >
          {{ suggested }}
        </v-chip>
      </v-chip-group>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useLocales } from '@/composable/repositories/useLocales'

export default defineComponent({
  name: 'LocaleField',

  inheritAttrs: false,

  props: {
    value: {
      type: String,
      default: ''
    },
    suggestLocales: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const { locales, formatLocale } = useLocales()

    const lastSelected = ref('')

    const locale = computed({
      get: () => props.value,
      set: (value) => emit('input', formatLocale(value))
    })

    const suggestedLocales = computed((): string[] => {
      const defaultSuggestion = ['en-US', 'en-CA', 'en-GB']
      if (!locale.value || defaultSuggestion.includes(locale.value)) {
        return defaultSuggestion
      }
      const filtered = locales.value.filter((item) => item.includes(locale.value))
      return [...filtered, ...defaultSuggestion].slice(0, 3)
    })

    const selectLocale = (suggested: string, index?: string) => {
      locale.value = suggested
      lastSelected.value = `${index}-${suggested}`
    }

    return {
      locale,
      suggestedLocales,
      selectLocale,
      lastSelected
    }
  }
})
</script>
