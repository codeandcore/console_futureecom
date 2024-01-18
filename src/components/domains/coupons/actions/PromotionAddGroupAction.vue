<template>
  <v-btn color="primary" small text @click="$emit('onClick', groupTemplate())">+ {{ $t('Group') }}</v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionAddGroupAction',

  setup() {
    const groupTemplate = () => ({
      logicalOperator: 'All',
      subsets: [],
      children: []
    })

    return {
      groupTemplate
    }
  }
})
</script>
