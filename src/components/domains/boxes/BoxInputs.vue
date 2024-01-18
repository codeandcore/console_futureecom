<template>
  <div class="d-flex flex-column flex-gap-32">
    <box-active v-model="box" />
    <box-name v-model="box" :rules="rules.required" />
    <div class="d-flex flex-column flex-gap-32 my-4">
      <box-size-unit v-model="box" clearable />
      <div class="d-flex flex-gap-16">
        <box-outer-length v-model="box" :rules="rules.required" />
        <box-outer-width v-model="box" :rules="rules.required" />
        <box-outer-depth v-model="box" :rules="rules.required" />
      </div>
      <div class="d-flex flex-gap-16">
        <box-inner-length v-model="box" :rules="rules.required" />
        <box-inner-width v-model="box" :rules="rules.required" />
        <box-inner-depth v-model="box" :rules="rules.required" />
      </div>
    </div>

    <div class="d-flex flex-column flex-gap-32 my-4">
      <box-weight-unit v-model="box" clearable />

      <div class="d-flex flex-gap-16">
        <box-empty-weight v-model="box" :rules="rules.required" />
        <box-max-weight v-model="box" :rules="rules.required" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useNotEmptyValidationRule } from '@/composable/validationRules'
import BoxActive from '@/components/domains/boxes/Box/BoxActive.vue'
import BoxEmptyWeight from '@/components/domains/boxes/Box/BoxEmptyWeight.vue'
import BoxInnerDepth from '@/components/domains/boxes/Box/BoxInnerDepth.vue'
import BoxInnerLength from '@/components/domains/boxes/Box/BoxInnerLength.vue'
import BoxInnerWidth from '@/components/domains/boxes/Box/BoxInnerWidth.vue'
import BoxMaxWeight from '@/components/domains/boxes/Box/BoxMaxWeight.vue'
import BoxName from '@/components/domains/boxes/Box/BoxName.vue'
import BoxOuterDepth from '@/components/domains/boxes/Box/BoxOuterDepth.vue'
import BoxOuterLength from '@/components/domains/boxes/Box/BoxOuterLength.vue'
import BoxOuterWidth from '@/components/domains/boxes/Box/BoxOuterWidth.vue'
import SizeUnitField from '@/components/common/SizeUnitField.vue'
import WeightUnitField from '@/components/common/WeightUnitField.vue'
import type { Box } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationRule } from '@/composable/validationRules'

export default defineComponent({
  name: 'BoxInputs',

  components: {
    BoxSizeUnit: SizeUnitField,
    BoxWeightUnit: WeightUnitField,
    BoxMaxWeight,
    BoxEmptyWeight,
    BoxOuterWidth,
    BoxOuterLength,
    BoxOuterDepth,
    BoxInnerWidth,
    BoxInnerLength,
    BoxInnerDepth,
    BoxName,
    BoxActive
  },

  props: {
    value: {
      type: Object as PropType<Box>,
      required: true
    }
  },

  setup(props, { emit }) {
    const box = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    const rules = {
      required: [(name: string | number): ValidationRule => useNotEmptyValidationRule(name)]
    }

    return {
      box,
      rules
    }
  }
})
</script>
