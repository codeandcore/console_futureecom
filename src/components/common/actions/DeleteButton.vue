<template>
  <v-dialog
    v-model="isDialogOpen"
    :disabled="suppressConfirmation"
    max-width="600"
    data-cy="delete-button-action-dialog-wrapper"
  >
    <template #activator="{ attrs, on }">
      <slot :activator="{ attrs, on }">
        <button-action
          v-bind="{ ...$attrs }"
          :icon-name="$attrs.icon ? 'delete' : ''"
          :label="$attrs.label || $t('Delete')"
          :color="$attrs.icon ? '' : 'error'"
          depressed
          v-on="{ ...$listeners, ...on }"
        />
      </slot>
    </template>

    <v-card v-if="isDialogOpen" data-cy="delete-button-action-dialog">
      <v-card-title class="d-flex justify-space-between">
        <slot name="dialog-title">
          <span>{{ $t('Delete confirmation') }}</span>
        </slot>
        <v-btn icon data-cy="delete-button-action-close" @click="isDialogOpen = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text data-cy="delete-button-action-content">
        <div class="d-flex mt-4">
          <slot name="dialog-content">
            <span data-cy="delete-button-action-title">{{ $t('Are you sure') }}?</span>
          </slot>
        </div>
      </v-card-text>

      <v-divider />

      <slot name="dialog-actions">
        <v-card-actions class="d-flex justify-space-between">
          <v-btn depressed color="secondary" data-cy="delete-action-no-btn" @click="isDialogOpen = false">
            {{ $t('No') }}
          </v-btn>
          <v-btn depressed color="primary" text data-cy="delete-action-yes-btn" @click="confirmHandler">
            {{ $t('Yes') }}
          </v-btn>
        </v-card-actions>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'

export default defineComponent({
  name: 'DeleteButton',
  components: { ButtonAction },

  inheritAttrs: false,

  props: {
    suppressConfirmation: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const isDialogOpen = ref(false)

    const confirmHandler = () => {
      emit('click')
      isDialogOpen.value = false
    }

    return {
      isDialogOpen,
      confirmHandler
    }
  }
})
</script>
