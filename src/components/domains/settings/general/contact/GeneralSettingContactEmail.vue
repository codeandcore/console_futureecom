<template>
  <v-text-field v-model="email" v-bind="$attrs" :label="$t('Email')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { ContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactEmail',

  props: {
    value: {
      type: Object as PropType<ContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const email = computed({
      get: () => props.value.email,
      set: (email) => emit('input', { ...props.value, email })
    })

    return {
      email
    }
  }
})
</script>
