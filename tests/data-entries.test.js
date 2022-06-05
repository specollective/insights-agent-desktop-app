const { postDataEntry } = require('../src/services/data-entries')

jest.mock('electron-fetch', () => {
  return { default: jest.fn() }
})

jest.mock('electron', () => {
  return { app: { isPackaged: false } }
})

describe('postDataEntry', () => {
  test('returns true', async () => {
    const mockData = {}

    await postDataEntry(mockData)

    expect(require('electron-fetch').default).toBeCalledWith(
      'https://insights-agent-api.specollective.org/api/data_entries/',
      {
        body: '{}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      },
    )
  })
})
