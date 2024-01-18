<template>
  <div class="align-center">
    <v-icon color="primary" class="mx-3">location_pin</v-icon>
    <span>
      {{ `${value.locality}, ${value.administrative_area} ${value.postal_code}` }}
    </span>
    <v-tooltip v-if="value.is_default" bottom class="">
      <template #activator="{ on, attrs }">
        <v-icon color="primary" v-bind="attrs" class="mx-3" v-on="on">star</v-icon>
      </template>
      <span>{{ $t('This is default address') }}</span>
    </v-tooltip>
    <v-spacer />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressLine',

  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
      required: true
    }
  }
})
</script>
