<template>
  <div class="d-flex">
    <v-icon v-if="showError" color="error" class="me-4">error</v-icon>
    <div class="d-flex flex-column grey--text text-caption">
      <span>{{ $t('Name') }}: {{ extras.name || 'N/A' }}</span>
      <span>{{ $t('Limit') }}: {{ extras.limit }}</span>
      <span>{{ $t('Options') }}: {{ extras.options.map((option) => option.value).join(', ') || 'N/A' }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { ProductExtras } from '@futureecom/futureecom-js/dist/services/catalog-service'

export default defineComponent({
  name: 'ProductExtraExpansionTile',

  props: {
    extras: {
      type: Object as () => ProductExtras,
      required: true
    },
    showError: {
      type: Boolean,
      default: false
    }
  }
})
</script>
