<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App'
})
</script>
 
<style lang="scss">
html {
  height: 100vh !important;
  overflow-y: auto !important; 
  
}

.v-navigation-drawer__border {
  z-index: 1;
}

a {
  text-decoration: none;
}
</style>
