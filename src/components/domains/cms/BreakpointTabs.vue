<template>
  <v-card flat outlined>
    <v-tabs v-model="tab" background-color="primary" dark>
      <template v-for="breakpoint in breakpoints">
        <v-tab :key="breakpoint">
          <template>
            <span>{{ breakpoint }}</span>
          </template>
        </v-tab>
      </template>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="breakpoint in breakpoints" :key="breakpoint" eager>
        <v-card class="pa-4" elevation="1">
          <slot :current-tab="tab" :name="breakpoint" :breakpoint="breakpoint" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'BreakpointTabs',

  setup() {
    const tab = ref(0)

    return {
      breakpoints: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
      tab
    }
  }
})
</script>
