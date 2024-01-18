<template>
  <v-dialog :value="true" max-width="600" persistent>
    <v-card>
      <v-card-title>{{ $t('Client created') }}</v-card-title>
      <v-divider />
      <v-card-text class="pa-4">
        <v-alert type="warning">
          {{ $t("Please store your secret, because you won't be able to see it once you close this view") }}
        </v-alert>
        <v-card flat class="d-flex justify-space-between blue-grey lighten-5 pa-4">
          <pre>{{ value.secret }}</pre>
          <copy-button-action :value="value.secret" />
        </v-card>
      </v-card-text>
      <v-divider />
      <v-card-actions class="d-flex justify-end">
        <v-btn depressed color="primary" :to="{ name: 'client-update', params: { id: value.id } }">
          {{ 'OK' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import CopyButtonAction from '@/components/common/actions/CopyButtonAction.vue'
import type { ClientCreated } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientCreatedWarning',
  components: { CopyButtonAction },

  props: {
    value: {
      type: Object as PropType<Pick<ClientCreated, 'id' | 'secret'>>,
      required: true
    }
  }
})
</script>
