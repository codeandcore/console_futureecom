<template>
  <div>
    <span>{{ $t('Extras') }}:</span>
    <div v-for="extra in value.extras" :key="extra.key" class="d-flex flex-column font-italic">
      <span>{{ extra.name }}: {{ extra.options.map((option) => option.value).join(', ') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { OrderableItem } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'OrderablePreviewItemExtras',

  props: {
    value: {
      type: Object as PropType<Pick<OrderableItem, 'extras'>>,
      required: true
    }
  }
})
</script>
