<template>
  <div class="toast-position-fixed toast-width d-flex flex-column">
    <v-fade-transition mode="out-in" group>
      <v-alert
        v-for="(toast, index) in toasts"
        :key="`${index}-${toast.uuid}`"
        :value="toast.visible"
        :type="toast.type"
        :dismissible="true"
      >
        <span>{{ toast.msg }}</span>
      </v-alert>
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useToasts } from '@/composable/useToasts'

export default defineComponent({
  name: 'ToastsQueue',

  setup() {
    const { toasts } = useToasts()

    return {
      toasts
    }
  }
})
</script>

<style lang="scss" scoped>
.toast-position-fixed {
  position: fixed;
  z-index: 203;
  bottom: 0;
  right: 20px;
}

.toast-width {
  width: 300px;
}
</style>
