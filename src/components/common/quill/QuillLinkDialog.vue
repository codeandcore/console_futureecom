<template>
  <v-dialog :value="value" width="800" @input="onChange">
    <v-card>
      <v-form @submit.prevent="applied">
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Assign link') }} {{ value }}</span>
          <v-icon @click="onChange(false)">close</v-icon>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-text-field
            v-model="url"
            class="my-4"
            outlined
            :label="$t('URL')"
            :error-messages="errors['url']"
            hide-details="auto"
            @input="onUrlChange"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="justify-end">
          <v-btn depressed color="primary" :disabled="!isValid" type="submit">
            {{ $t('Apply') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import { useValidator } from '@/composable/validator/useValidator'
import type { RuleDefinitions } from '@/types/validator'

export default defineComponent({
  name: 'QuillLinkDialog',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  emits: {
    close: (_: boolean) => true,
    apply: (_: string) => true
  },

  setup(props, { emit }) {
    const url = ref('')

    const { errors, validate, isValid, setErrors } = useValidator({ url: url.value })

    const rules: RuleDefinitions = { url: ['required'] }
    const onUrlChange = () => validate({ url: url.value }, rules)

    const onChange = (val: boolean) => {
      emit('close', val)
      if (!val) {
        url.value = ''
        setErrors({})
      }
    }

    const applied = () => {
      emit('apply', url.value)
      onChange(false)
    }

    return {
      url,
      errors,
      isValid,
      applied,
      onUrlChange,
      onChange
    }
  }
})
</script>
