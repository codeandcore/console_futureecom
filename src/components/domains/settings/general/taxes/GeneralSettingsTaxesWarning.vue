<template>
  <div>
    <span class="text-caption error--text">
      {{ $t('Changing these settings requires products and shipping methods reindex') }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingsTaxesWarning'
})
</script>
