import {
  verifySerialNumber,
} from 'services/authentication'


// jest.mock('electron-fetch', () => {
//   return { default: jest.fn() }
// })

jest.mock('electron', () => {
  return { app: { isPackaged: false } }
})

describe("verifySerialNumber", () => {
  it("returns true", async () => {
    const mockSerialNumber = [];

    await verifySerialNumber(mockSerialNumber);

    expect(require("electron-fetch").default).toBeCalledWith(
      "http://localhost:6000/api/confirm_serial_number",
      {
        body: '{"data":[]}',
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );
  });
});

// describe('buildDataEntryFromWindowData', () => {
//   it('builds data entry', async () => {
//     const dataEntry = buildDataEntryFromWindowData({
//       appName: 'a',
//       tabName: 'b',
//       url: 'https://example.com/about_us',
//       isConnected: true,
//     });

//     expect(dataEntry.application_name).toEqual('a');
//     expect(dataEntry.tab_name).toEqual('b');
//     expect(dataEntry.url).toEqual('https://example.com');
//     expect(dataEntry.internet_connection).toEqual('online');
//   });
// });
