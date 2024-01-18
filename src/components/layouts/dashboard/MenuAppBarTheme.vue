<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon dark v-bind="attrs" class="mx-3" v-on="on">mdi-brightness-3</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('Theme') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MenuAppBarTheme'
})
</script>
