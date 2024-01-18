import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import TablePaginationControls from '@/components/tables/pagination/TablePaginationControls.vue'

export const attributes = {
  component: 'table-pagination-controls',
  firstPageBtn: 'table-pagination-controls-first-page',
  previousPageBtn: 'table-pagination-controls-previous-page',
  currentPageInput: 'table-pagination-controls-current-page-input',
  metaLastPage: 'table-pagination-controls-meta-last-page',
  nextPageBtn: 'table-pagination-controls-next-page',
  lastPageBtn: 'table-pagination-controls-last-page'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getFirstPageBtn = () => screen.getByTestId(attributes.firstPageBtn)
  const getPreviousPageBtn = () => screen.getByTestId(attributes.previousPageBtn)
  const getCurrentPageInput = () => screen.getByTestId(attributes.currentPageInput)
  const getMetaLastPage = () => screen.getByTestId(attributes.metaLastPage)
  const getNextPageBtn = () => screen.getByTestId(attributes.nextPageBtn)
  const getLastPageBtn = () => screen.getByTestId(attributes.lastPageBtn)

  const jumpToFirstPage = async () => await fireEvent.click(getFirstPageBtn())
  const jumpToPreviousPage = async () => await fireEvent.click(getPreviousPageBtn())
  const jumpToNextPage = async () => await fireEvent.click(getNextPageBtn())
  const jumpToLastPage = async () => await fireEvent.click(getLastPageBtn())

  const setPage = async (value: string) => {
    const element = getCurrentPageInput()
    await fireEvent.focus(element)
    await fireEvent.update(element, value)
    await fireEvent.blur(element)
  }

  return {
    getComponent,
    getFirstPageBtn,
    getPreviousPageBtn,
    getCurrentPageInput,
    getMetaLastPage,
    getNextPageBtn,
    getLastPageBtn,
    jumpToFirstPage,
    jumpToPreviousPage,
    jumpToNextPage,
    jumpToLastPage,
    setPage
  }
}

describe('TablePaginationControls component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount TablePaginationControls component correctly', () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    renderWithMainApp(TablePaginationControls, { propsData: { meta } })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('changes page to last and emits updated page', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToLastPage()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 4 })
  })

  it('changes page to the next one and emits updated page', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToNextPage()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 2 })
  })

  it('changes page to first and emits updated page', async () => {
    const meta = { current_page: 4, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToFirstPage()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 1 })
  })

  it('changes page to the previous one and emits updated page', async () => {
    const meta = { current_page: 4, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToPreviousPage()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 3 })
  })

  it('allows to set a page and emits updated page after 700ms delay', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    jest.useFakeTimers()
    await fixtures().setPage('2')

    jest.advanceTimersByTime(1000)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 2 })
    jest.useRealTimers()
  })

  it('sets last page when user sets page bigger than last one', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    jest.useFakeTimers()
    await fixtures().setPage('10')

    jest.advanceTimersByTime(1000)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 4 })
    jest.useRealTimers()
  })

  it('sets page to 1 if user sets page less than 1', async () => {
    const meta = { current_page: 2, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    jest.useFakeTimers()
    await fixtures().setPage('-1')

    jest.advanceTimersByTime(1000)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 1 })
    jest.useRealTimers()
  })

  it('does not emit any value if it is the same as already provided', async () => {
    const meta = { current_page: 2, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    jest.useFakeTimers()
    await fixtures().setPage('2')

    jest.advanceTimersByTime(1000)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(undefined)
    jest.useRealTimers()
  })

  it('does not emit updated value on last page click button when page is actually last one', async () => {
    const meta = { current_page: 4, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToLastPage()
    expect(getEmittedEventValue(wrapper, 'input')).toBe(undefined)
  })

  it('does not emit updated value on next page click button when page is actually last one', async () => {
    const meta = { current_page: 4, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToNextPage()
    expect(getEmittedEventValue(wrapper, 'input')).toBe(undefined)
  })

  it('does not emit updated value on first page click button when page is actually first one', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToFirstPage()
    expect(getEmittedEventValue(wrapper, 'input')).toBe(undefined)
  })

  it('does not emit updated value on previous page click button when page is actually first one', async () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TablePaginationControls, { propsData: { meta } })

    await fixtures().jumpToPreviousPage()
    expect(getEmittedEventValue(wrapper, 'input')).toBe(undefined)
  })
})
