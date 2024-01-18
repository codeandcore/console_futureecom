<template>
  <v-dialog :value="show" max-width="600" scrollable>
    <v-card>
      <v-card-title class="justify-space-between">
        <span>
          {{ $t('Connection info') }}
        </span>
        <v-icon size="32" @click="$emit('close')">
          {{ $t('close') }}
        </v-icon>
      </v-card-title>
      <v-divider />
      <v-card-text class="d-flex align-center justify-start">
        <v-slide-y-reverse-transition mode="out-in">
          <div class="mx-4 my-4">
            <p v-if="info.status">
              <span class="font-weight-bold">{{ $t('Status') }}:</span>
              <span>{{ info.status }}</span>
            </p>
            <p v-if="info.version">
              <span class="font-weight-bold">{{ $t('Version') }}:</span>
              <span>{{ info.version }}</span>
            </p>
            <p>
              <span class="font-weight-bold">{{ $t('Authenticated') }}:</span>
              <span>{{ info.authenticated ? $t('yes') : $t('no') }}</span>
            </p>
            <p v-if="info.authenticationType">
              <span class="font-weight-bold">{{ $t('Authentication Type') }}:</span>
              <span>{{ info.authenticationType }}</span>
            </p>
            <p v-if="info.authenticatedUserName">
              <span class="font-weight-bold">{{ $t('Authentication Username') }}:</span>
              <span>{{ info.authenticatedUserName }}</span>
            </p>
            <p v-if="info.authenticatedUserId">
              <span class="font-weight-bold">{{ $t('Authentication User ID') }}:</span>
              <span>{{ info.authenticatedUserId }}</span>
            </p>
            <p v-if="info.authenticatedAccountId">
              <span class="font-weight-bold">{{ $t('Authentication Account ID') }}:</span>
              <span>{{ info.authenticatedAccountId }}</span>
            </p>
            <p v-if="info.authenticatedCompanyId">
              <span class="font-weight-bold">{{ $t('Authentication Company ID') }}:</span>
              <span>{{ info.authenticatedCompanyId }}</span>
            </p>
            <p v-if="info.crmid">
              <span class="font-weight-bold">{{ $t('Crmid') }}:</span>
              <span>{{ info.crmid }}</span>
            </p>
          </div>
        </v-slide-y-reverse-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { AvalaraTestConnection } from '@futureecom/futureecom-js/dist/services/tax-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AvalaraConnectionModal',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object as PropType<AvalaraTestConnection>,
      required: true
    }
  }
})
</script>
