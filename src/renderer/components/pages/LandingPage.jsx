import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  function confirmSerialNumber() {
    window.api.confirmSerialNumber()
  }

  useEffect(() => {
    window.api.onConfirmSerialNumberSuccess(() => navigate('/setup'))
    window.api.onConfirmSerialNumberError((error) => alert(error))

    // https://patrickpassarella.com/blog/creating-electron-react-app
    return () => window.api.removeAllListeners()
  }, [])

  return (
    <div className='grid place-items-center h-screen'>
      <div className='grid place-items-center text-center'>
        <div>
          <button
            onClick={confirmSerialNumber}
            className="rounded w-full h-11 bg-[#70B443] text-xl font-semibold"
          >
            Continue Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage
