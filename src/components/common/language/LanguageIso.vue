<template>
  <locale-field v-model="iso" outlined v-bind="$attrs" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import LocaleField from '@/components/common/LocaleField.vue'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'LanguageIso',
  components: { LocaleField },
  props: {
    value: {
      type: Object as () => Language,
      required: true
    }
  },

  setup(props, { emit }) {
    const iso = computed({
      get: () => props.value.iso,
      set: (iso) => emit('input', { ...props.value, iso })
    })

    return {
      iso
    }
  }
})
</script>
