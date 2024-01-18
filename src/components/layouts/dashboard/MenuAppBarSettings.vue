<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <router-link :to="{ name: 'settings' }">
        <v-icon dark v-bind="attrs" class="mx-3" v-on="on">tune</v-icon>
      </router-link>
    </template>
    <span>{{ $t('Store Settings') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MenuAppBarSettings'
})
</script>
