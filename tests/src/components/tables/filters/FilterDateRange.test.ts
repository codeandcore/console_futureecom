import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import FilterDateRange from '@/components/tables/filters/FilterDateRange.vue'

describe('FilterDateRange input component test', () => {
  const attributes = {
    input: 'filter-date-range-input',
    modal: 'filter-date-range-date-picker',
    picker: 'filter-date-range-picker',
    btnApply: 'filter-date-range-button-apply',
    btnCancel: 'filter-date-range-button-cancel'
  }

  const getInput = () => screen.getByTestId(attributes.input)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount FilterDateRange component correctly', () => {
    renderWithMainApp(FilterDateRange, { propsData: { label: 'Date range' } })
    expect(getInput()).toHaveAttribute('data-cy', attributes.input)
  })

  it('should open calendar picker with apply and cancel button on input click', async () => {
    renderWithMainApp(FilterDateRange)

    expect(screen.queryByTestId(attributes.modal)).not.toBeInTheDocument()
    expect(screen.queryByTestId(attributes.btnApply)).not.toBeInTheDocument()
    expect(screen.queryByTestId(attributes.btnCancel)).not.toBeInTheDocument()

    await fireEvent.click(getInput())

    expect(screen.queryByTestId(attributes.modal)).toBeInTheDocument()
    expect(screen.queryByTestId(attributes.btnApply)).toBeInTheDocument()
    expect(screen.queryByTestId(attributes.btnCancel)).toBeInTheDocument()
  })

  it('should close modal on cancel button click', async () => {
    renderWithMainApp(FilterDateRange)

    await fireEvent.click(getInput())

    const btnCancel = await screen.getByTestId(attributes.btnCancel)
    await fireEvent.click(btnCancel)

    expect(screen.queryByTestId(attributes.modal)).not.toBeInTheDocument()
  })

  it('selects date, emits selected values, closes dialog on accept button click and updates the input', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

    const wrapper = renderWithMainApp(FilterDateRange)

    await fireEvent.click(getInput())
    const picker = screen.getByTestId(attributes.picker)

    const firstDate = picker.querySelectorAll(
      '.v-btn.v-date-picker-table__current.v-btn--rounded.v-btn--outlined.theme--light.accent--text'
    )
    const availableConsecutiveDates = picker.querySelectorAll('.v-btn.v-btn--text.v-btn--rounded')

    await fireEvent.click(firstDate[0])
    await fireEvent.click(availableConsecutiveDates[6])

    await fireEvent.click(screen.getByTestId(attributes.btnApply))

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      gte: '2023-01-01',
      lte: '2023-01-08'
    })

    expect(screen.queryByTestId(attributes.modal)).not.toBeInTheDocument()
    jest.useRealTimers()
  })
})
