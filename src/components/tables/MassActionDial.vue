<template>
  <v-menu v-bind="$attrs">
    <template #activator="{ on, attrs }">
      <v-btn small color="primary" v-bind="attrs" depressed v-on="on">
        <span>{{ $t('Actions') }} ({{ count }})</span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title class="d-flex flex-column flex-gap-16 my-2">
          <slot />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MassActionDial',

  props: {
    count: {
      type: Number,
      default: 0
    }
  }
})
</script>
