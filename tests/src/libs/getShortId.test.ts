import getShortId from '@/libs/getShortId'

describe('getShortId util tests', () => {
  it('gets first segment of ID', () => {
    expect(getShortId('af85e876-6c37-11ee-b962-0242ac120002')).toBe('af85e876')
    expect(getShortId('')).toBe('')
  })
})
