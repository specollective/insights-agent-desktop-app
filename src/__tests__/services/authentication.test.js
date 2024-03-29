import { confirmSerialNumber } from 'services/authentication'
import {
  CONFIRM_SERIAL_NUMBER_SUCCESS,
  CONFIRM_SERIAL_NUMBER_ERROR,
} from 'constants/events'
import electronFetch from 'electron-fetch'

jest.mock('electron-fetch')

jest.mock('electron-store', () => {
  class Store {
    set () {}
    get () {
      return 'MOCK_SERIAL_NUMBER'
    }
  }
  
  return Store;
})

jest.mock('electron', () => {
  return { app: { isPackaged: false } }
})

describe('confirmSerialNumber', () => {
  beforeEach(() => {
    electronFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => ({}),
      })
    })
  })

  it('calls fetch with correct parameters', async () => {
    const mockIPCEvent = {
      sender: {
        send: jest.fn()
      },
    }

    await confirmSerialNumber(mockIPCEvent, {});

    expect(require('electron-fetch').default).toBeCalledWith(
      'https://localhost:8000/api/confirm_serial_number',
      {
        body: "{\"serial_number\":\"MOCK_SERIAL_NUMBER\"}",
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
      },
    )
  })

  it('handles events for success states', async () => {
    const mockIPCEvent = {
      sender: {
        send: jest.fn()
      },
    }

    await confirmSerialNumber(mockIPCEvent, {});

    expect(mockIPCEvent.sender.send).toBeCalledWith(
      CONFIRM_SERIAL_NUMBER_SUCCESS,
      'success',
    )
  })

  it('handles events for error states', async () => {
    electronFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'error' }),
      })
    })

    const mockIPCEvent = {
      sender: {
        send: jest.fn()
      },
    }

    await confirmSerialNumber(mockIPCEvent, {});

    expect(mockIPCEvent.sender.send).toBeCalledWith(
      CONFIRM_SERIAL_NUMBER_ERROR,
      'error',
    )
  })
})
