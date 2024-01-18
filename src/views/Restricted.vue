<template>
  <div class="d-flex justify-center">
    <span class="my-15 text-body-1 text--disabled" v-text="$t(message)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Restricted',

  props: {
    message: {
      type: String,
      default: "You don't have permissions to view this page"
    }
  }
})
</script>
