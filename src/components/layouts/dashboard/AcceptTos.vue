<template>
  <v-card flat>
    <v-card-title class="text-h6">
      {{ $t('Terms of Service') }}
    </v-card-title>

    <v-divider />

    <v-card-text v-html="tos.contents" />

    <v-divider />

    <v-card-actions class="px-3">
      <v-checkbox v-model="accepted">
        <template #label>
          <div>
            <span>{{ $t('I have read and agree to the FutureEcom') }}</span>
            <a target="_blank" href="//www.futureecom.com/terms-of-service/">
              {{ $t('Terms of Service') }}
            </a>
          </div>
        </template>
      </v-checkbox>
      <v-spacer />
      <v-btn :loading="loading" :disabled="!accepted" color="primary" depressed @click="$emit('onAccept', tos.version)">
        {{ $t('Accept') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { Term } from '@futureecom/futureecom-js/dist/services/auth-service'

export default defineComponent({
  name: 'AcceptTos',

  props: {
    tos: {
      type: Object as PropType<Term>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const accepted = ref(false)

    return {
      accepted
    }
  }
})
</script>
