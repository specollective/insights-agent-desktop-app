import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function LandingPage() {
  const [isLoading, setLoading] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  function confirmSerialNumber() {
    setLoading(true)
    window.api.confirmSerialNumber()
  }

  useEffect(() => {
    window.api.onConfirmSerialNumberSuccess(() => navigate('/setup'))
    window.api.onConfirmSerialNumberError((error) => alert(error))
    window.api.onMainNavigation((routeName) => navigate(routeName))

    return () => window.api.removeAllListeners()
  }, [])

  return (
    <div className='grid place-content-center h-screen'>
      <div>
        <div>
          <h1 className='py-2 text-2xl font-bold'>
            { t('landingPage.heading') }
          </h1>
          <ol className='py-4 pl-10 text-lg list-decimal'>
            <li>Register the device's serial number with buildJUSTLY.</li>
            <li>Connect device to the Internet.</li>
            <li>Run Insights Agent app as an administrator. </li>
            <li>Click the "Test Device" button.</li>
          </ol>
          <p className='py-2 text-lg'>
            By clicking on the "Test Device" button below will connect your device with the Insights Agent server.
          </p>
        </div>

        <div className="float-right pt-8">
          <button
            onClick={confirmSerialNumber}
            disabled={isLoading}
            className="rounded p-2 h-11 bg-[#70B443] text-xl font-semibold"
          >
            { isLoading ? 'Loading...' : 'Test' }
          </button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
