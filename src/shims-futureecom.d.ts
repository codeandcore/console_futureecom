import type { UseMoney } from '@/composable/useMoney'
import type { UseTimezone } from '@/composable/useTimezone'
import type { ComputedRef } from '@vue/composition-api'
import type { UseMasks } from '@/composable/useMasks'
import type { abilities } from '@/types/Abilities'

declare module 'vue/types/vue' {
  interface Vue {
    $toast: Toasts
    $format: {
      money: UseMoney
      timezone: UseTimezone
      requestedDelivery: (value: string, fmt?: Intl.DateTimeFormat) => string
      mask: UseMasks
    }
    $can: (...scope: abilities[]) => ComputedRef<boolean>
    $canAny: (...scope: abilities[]) => ComputedRef<boolean>
  }
}
