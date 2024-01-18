<template>
  <form-validator-wrapper @submit="submit">
    <template #default="{ valid }">
      <scrollable :height="`calc(100vh - ${$vuetify.application.top}px)`">
        <template #sticky>
          <slot name="header" :valid="valid" />
          <v-divider />
        </template>
        <template #scrollable-content>
          <div class="d-flex flex-column mx-6">
            <h2 class="my-4">
              {{ $t('Dimensions') }}
            </h2>
            <div class="d-flex mt-4">
              <v-select
                v-model="form.dimensions.size_unit"
                outlined
                :items="sizeUnits"
                :label="$t('Size Unit')"
                class="me-4"
                hide-details
              />
              <v-select
                v-model="form.dimensions.weight_unit"
                outlined
                :items="weightUnits"
                :label="$t('Weight Unit')"
                class="ms-4"
                hide-details
              />
            </div>
          </div>
          <v-divider class="my-6" />
          <div class="d-flex flex-column mx-6">
            <h2 class="my-4">
              {{ $t('Inventory') }}
            </h2>
            <div class="d-flex flex-column flex-gap-16">
              <v-select
                v-model="form.inventory.policy"
                outlined
                :items="['stop', 'continue']"
                :label="$t('Policy')"
                class="me-4"
                hide-details
              />
              <switch-field v-model="form.inventory.is_available" :label="$t('Is available')" />
              <switch-field v-model="form.inventory.is_restockable" :label="$t('Is restockable')" />
              <switch-field v-model="form.inventory.track" :label="$t('Track')" />
            </div>
          </div>
        </template>
      </scrollable>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { InventoryPolicy } from '@futureecom/futureecom-js/dist/services/catalog-service'
import { defineComponent, ref } from '@vue/composition-api'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { CatalogSettings, Settings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { SizeUnit, WeightUnit } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'SettingsCatalog',

  components: { Scrollable, FormValidatorWrapper, SwitchField },

  props: {
    value: {
      type: Object as PropType<Settings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const template: CatalogSettings = {
      dimensions: {
        size_unit: 'cm',
        weight_unit: 'g'
      },
      inventory: {
        is_available: false,
        is_restockable: false,
        track: false,
        policy: InventoryPolicy.STOP
      }
    }

    const form = ref<CatalogSettings>({ ...template, ...props.value.catalog })

    const sizeUnits: SizeUnit[] = ['cm', 'in', 'ft', 'mm', 'm', 'yd']
    const weightUnits: WeightUnit[] = ['g', 'oz', 'lb', 'kg']

    const submit = (): void => emit('submit', { code: 'catalog', payload: form.value })

    return {
      submit,
      form,
      sizeUnits,
      weightUnits
    }
  }
})
</script>
