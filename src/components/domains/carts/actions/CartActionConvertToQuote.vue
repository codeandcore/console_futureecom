<template>
  <v-dialog v-model="isDialogOpen" max-width="600">
    <template #activator="{ attrs, on }">
      <v-btn v-bind="attrs" small depressed color="primary" class="ma-6" v-on="on">
        {{ $t('Request Quote') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <slot name="dialog-title">
          <span>{{ $t('Are you sure?') }}</span>
        </slot>
        <v-btn icon @click="isDialogOpen = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="d-flex mt-4">
          <slot name="dialog-content">
            <span>{{ $t("You won't be able to revert this action") }}</span>
          </slot>
        </div>
      </v-card-text>

      <v-divider />

      <slot name="dialog-actions">
        <v-card-actions class="d-flex justify-space-between">
          <v-btn depressed color="secondary" :disabled="loadingRequest" @click="isDialogOpen = false">
            {{ $t('No') }}
          </v-btn>
          <v-btn depressed color="primary" text :loading="loadingRequest" @click="confirmHandler">
            {{ $t('Yes') }}
          </v-btn>
        </v-card-actions>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Cart } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartActionConvertToQuote',

  inheritAttrs: false,

  props: {
    value: {
      type: Object as PropType<Cart>,
      required: true
    }
  },

  setup(props, { root }) {
    const loadingRequest = ref(false)
    const isDialogOpen = ref(false)

    const confirmHandler = () => {
      loadingRequest.value = true

      useApi()
        .carts.convertToQuote(props.value.id)
        .then(({ id }) => root.$router.push({ name: 'quote-update', params: { id } }))
        .catch((err) => {
          root.$toast.addErrorToast(err.response?.data.message || root.$t('Unable to convert cart to quote'))
        })
        .finally(() => (loadingRequest.value = false))
    }

    return {
      isDialogOpen,
      loadingRequest,
      confirmHandler
    }
  }
})
</script>
