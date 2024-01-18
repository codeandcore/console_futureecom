<template>
  <div v-if="value.fields" class="mt-4 pb-5" xs12>
    <div class="label">
      <span class="font-weight-regular">{{ $t('Available variables') }}:</span>
    </div>
    <ul class="mb-2">
      <li v-for="(field, name) in value.fields" :key="name">
        <span class="font-weight-regular">{{ name }}</span>
        -
        <span class="font-weight-light">{{ field.description }}</span>
        <span class="mx-3">{{ field.types }}</span>
      </li>
    </ul>
    <span class="font-weight-light">
      {{ $t('The HTML and Scripts fields support the') }}
      <a href="https://mustache.github.io/mustache.5.html">{{ $t('mustache template syntax') }}</a>
      .
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { Page } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PageAvailableVariables',

  props: {
    value: {
      type: Object as PropType<Page>,
      required: true
    }
  }
})
</script>
