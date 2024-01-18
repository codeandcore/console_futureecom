import movePointerPosition from '@/libs/movePointerPosition'

describe('Test for moving floating pointer', () => {
  it('moves by two points forward from 100 to 10000', () => {
    expect(movePointerPosition(100, 2)).toEqual('10000')
  })
  it('moves by two points backward from 10000 to 100', () => {
    expect(movePointerPosition(10000, -2)).toEqual('100')
  })
  it('moves by two points backward from 1 to 0.01', () => {
    expect(movePointerPosition(1, -2)).toEqual('0.01')
  })
  it('moves by two points backward from 0 to 0', () => {
    expect(movePointerPosition(0, -2)).toEqual('0')
  })
  it('moves by two points forward from 0 to 0', () => {
    expect(movePointerPosition(0, 2)).toEqual('0')
  })
})
