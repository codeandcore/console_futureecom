import type { RenderResult } from '@testing-library/vue'

export const getEmittedEventValue = (wrapper: RenderResult, eventName: string) => {
  return (wrapper.emitted()[eventName] || []).at(-1)?.[0]
}

export const hasEmittedEvent = (wrapper: RenderResult, eventName: string) => eventName in wrapper.emitted()
