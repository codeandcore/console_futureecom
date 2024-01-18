<template>
  <div>
    <span>{{ $t('If') }}</span>

    <v-btn-toggle :value="value" class="transparent mx-2" mandatory @input="$emit('input', $event)">
      <v-btn value="Any" small text depressed>
        {{ $t('any') }}
      </v-btn>
      <v-btn value="All" small text depressed>
        {{ $t('all') }}
      </v-btn>
    </v-btn-toggle>

    <span>{{ $t('of the following are true:') }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'CouponLogicalOperator',

  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>
