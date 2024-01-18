<template>
  <v-menu v-if="currentLanguage" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" depressed icon v-on="on">
        <flag :iso="currentLanguage.flag" />
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in languages" :key="index" @click="setLanguage(item)">
        <v-list-item-icon>
          <flag :iso="item.flag" />
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t(item.name) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useAppLanguages } from '@/composable/repositories/useAppLanguages'

export default defineComponent({
  name: 'LanguageSwitch',

  setup() {
    const { languages, currentLanguage, initLanguage, setLanguage } = useAppLanguages()

    initLanguage()

    return {
      currentLanguage,
      languages,
      setLanguage
    }
  }
})
</script>
