import {
  confirmSerialNumber,
} from 'services/authentication'

jest.mock('electron-fetch', () => {
  return {
    default: jest.fn().mockReturnValue(Promise.resolve({
      ok: true,
      json: () => {
        return {};
      },
    }))
  }
})


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

  it('calls IPC event with success message', async () => {
    const mockIPCEvent = {
      sender: {
        send: jest.fn()
      },
    }

    await confirmSerialNumber(mockIPCEvent, {});

    expect(mockIPCEvent.sender.send).toBeCalledWith(
      'confirm-serial-number-success',
      'success',
    );
  })
});