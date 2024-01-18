<template>
  <v-hover v-slot="{ hover }">
    <v-menu :value="hover" offset-y open-on-hover>
      <template #activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <slot name="thumbnail" />
        </div>
      </template>
      <v-card flat>
        <slot name="zoom" />
      </v-card>
    </v-menu>
  </v-hover>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ImageZoom'
})
</script>
