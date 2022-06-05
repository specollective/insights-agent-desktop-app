const { postDataEntry } = require('../src/services/data-entries')

jest.mock('electron-fetch', () => {
  return { default: jest.fn() }
})

describe('postDataEntry', () => {
  test('returns true', async () => {
    const mockData = {}

    await postDataEntry(mockData)

    expect(require('electron-fetch').default).toBeCalledWith(
      'http://localhost:8000/api/data_entries/',
      {
        body: '{}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      },
    )
  })
})
