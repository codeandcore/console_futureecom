<template>
  <form-validator-wrapper @submit="$emit('submit')">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <v-card flat>
            <slot name="top" :valid="valid" />
          </v-card>
          <v-divider />
        </template>
        <template #scrollable>
          <slot name="content" />
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'

export default defineComponent({
  name: 'ScrollableWrapper',

  components: { FormValidatorWrapper, Scrollable }
})
</script>
