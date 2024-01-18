<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-icon color="grey" dark v-bind="attrs" v-on="on">help</v-icon>
    </template>
    <span>{{ $t('You have no permissions for this') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'NoPermissionsTooltip'
})
</script>
