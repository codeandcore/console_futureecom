<template>
  <v-card v-bind="$attrs" outlined>
    <v-card-text>
      <div class="d-flex align-center flex-grow-1 grey--text">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ReadonlyCard'
})
</script>
