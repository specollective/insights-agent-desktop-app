import {
  postDataEntries,
  buildDataEntryFromWindowData,
} from 'services/data-entries'

import electronFetch from 'electron-fetch'

jest.mock('electron-fetch')

jest.mock('electron', () => {
  return { app: { isPackaged: false } }
})

describe('postDataEntries', () => {
  beforeEach(() => {
    electronFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => ({}),
      })
    })
  });

  it('returns true', async () => {
    const mockData = []

    await postDataEntries(mockData)

    expect(require('electron-fetch').default).toBeCalledWith(
      'https://localhost:8000/agent-data-ingestion',
      {
        body: '{"data":[]}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      },
    )
  })
})

describe('buildDataEntryFromWindowData', () => {
  it('builds data entry', async () => {
    const dataEntry = buildDataEntryFromWindowData({
      appName: 'a',
      tabName: 'Profile for Jose Torres',
      url: 'https://example.com/about_us',
      isConnected: true,
      idleTime: 2,
    })

    expect(dataEntry.application_name).toEqual('a')
    // NOTE: The name is filtered to remote PII
    expect(dataEntry.tab_name).toEqual('Profile for PERSON_NAME')
    // NOTE: The URL removes path and query params
    expect(dataEntry.url).toEqual('https://example.com')
    expect(dataEntry.internet_connection).toEqual('online')
    expect(dataEntry.idle_time).toEqual(2)
  })
})
