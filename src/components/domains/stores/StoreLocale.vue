<template>
  <div>
    <span class="mb-4 text-caption d-block">
      {{ $t('general.settings.locale') }}
    </span>
    <locale-field v-model="locale" suggest-locales :error-messages="errors['locale']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import LocaleField from '@/components/common/LocaleField.vue'
import type { NewStore } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'StoreLocale',
  components: { LocaleField },
  props: {
    value: {
      type: Object as () => NewStore,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const locale = computed({
      get: () => props.value.locale || '',
      set: (locale) => emit('input', { ...props.value, locale })
    })

    return {
      locale
    }
  }
})
</script>
