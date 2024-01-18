import { paginateCollection, sortCollection } from '@/libs/tables/grid'

describe('Grid helpers for sorting', () => {
  const collection = [
    {
      word: 'reality',
      age: 4,
      nested: { nested_foo: 'blind', nested_bar: 11 }
    },
    {
      word: 'elite',
      age: 8,
      nested: { nested_foo: 'trick', nested_bar: 1 }
    },
    {
      word: 'garage',
      age: 5,
      nested: { nested_foo: 'manufacture', nested_bar: 2 }
    },
    {
      word: 'oven',
      age: 1,
      nested: { nested_foo: 'concession', nested_bar: 20 }
    }
  ]

  it('doesnt mutate provided collection after sorting', () => {
    const sorted = sortCollection(collection, 'word')
    expect(sorted).not.toStrictEqual(collection)
  })

  it('sorts array of object ascending root field properly', () => {
    const sortedString = sortCollection(collection, 'word')
    const expectedStringSorted = [
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      }
    ]
    expect(sortedString).toStrictEqual(expectedStringSorted)

    const sortedNumbers = sortCollection(collection, 'age')

    const expectedNumberSorted = [
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },

      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      }
    ]
    expect(sortedNumbers).toStrictEqual(expectedNumberSorted)
  })
  it('sorts array of nested objects ascending properly', () => {
    const sortedString = sortCollection(collection, 'nested.nested_foo')
    const expectedStringSorted = [
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      }
    ]
    expect(sortedString).toStrictEqual(expectedStringSorted)

    const sortedNumbers = sortCollection(collection, 'nested.nested_bar')

    const expectedNumberSorted = [
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      }
    ]

    expect(sortedNumbers).toStrictEqual(expectedNumberSorted)
  })

  it('sorts array of object descending root field properly', () => {
    const sortedString = sortCollection(collection, '-word')
    const expectedStringSorted = [
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      }
    ]
    expect(sortedString).toStrictEqual(expectedStringSorted)

    const sortedNumbers = sortCollection(collection, '-age')
    const expectedNumberSorted = [
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      }
    ]
    expect(sortedNumbers).toStrictEqual(expectedNumberSorted)
  })
  it('sorts array of nested objects descending properly', () => {
    const sortedString = sortCollection(collection, '-nested.nested_foo')
    const expectedStringSorted = [
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      }
    ]
    expect(sortedString).toStrictEqual(expectedStringSorted)

    const sortedNumbers = sortCollection(collection, '-nested.nested_bar')
    const expectedNumberSorted = [
      {
        word: 'oven',
        age: 1,
        nested: { nested_foo: 'concession', nested_bar: 20 }
      },
      {
        word: 'reality',
        age: 4,
        nested: { nested_foo: 'blind', nested_bar: 11 }
      },
      {
        word: 'garage',
        age: 5,
        nested: { nested_foo: 'manufacture', nested_bar: 2 }
      },
      {
        word: 'elite',
        age: 8,
        nested: { nested_foo: 'trick', nested_bar: 1 }
      }
    ]
    expect(sortedNumbers).toStrictEqual(expectedNumberSorted)
  })
})

describe('Grid helpers for pagination', () => {
  const collection = Array.from(Array(30)).map(() => Math.random() * 100 + 1)

  it('returns proper default pagination', () => {
    const pagination = paginateCollection(collection.length)
    const expected = {
      current_page: 1,
      per_page: 10,
      last_page: 3,
      from_item_index: 0,
      to_item_index: 10,
      total: 30
    }
    expect(pagination).toStrictEqual(expected)
  })
  it('returns proper pagination for negative page', () => {
    const pagination = paginateCollection(collection.length, -1)
    const expected = {
      current_page: 1,
      per_page: 10,
      last_page: 3,
      from_item_index: 0,
      to_item_index: 10,
      total: 30
    }
    expect(pagination).toStrictEqual(expected)
  })
  it('returns proper pagination for negative perPage', () => {
    const pagination = paginateCollection(collection.length, 1, -1)
    const expected = {
      current_page: 1,
      per_page: -1,
      last_page: 1,
      from_item_index: 0,
      to_item_index: 30,
      total: 30
    }
    expect(pagination).toStrictEqual(expected)
  })
  it('returns proper pagination for 2nd page and per page = 10', () => {
    const pagination = paginateCollection(collection.length, 2, 10)
    const expected = {
      current_page: 2,
      per_page: 10,
      last_page: 3,
      from_item_index: 10,
      to_item_index: 20,
      total: 30
    }
    expect(pagination).toStrictEqual(expected)
  })
  it('returns proper pagination for 2nd page and per page that returns floating numbers', () => {
    const pagination = paginateCollection(collection.length, 2, 7)
    const expected = {
      current_page: 2,
      per_page: 7,
      last_page: 5,
      from_item_index: 7,
      to_item_index: 14,
      total: 30
    }
    expect(pagination).toStrictEqual(expected)
  })
})
