import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from 'constants/routes'

function ExitPage() {
  const [appState, setAppState] = useState()
  const navigate = useNavigate()
  const continueSurvey = ( )=> navigate(ROUTES[appState.ONBOARDING_STEP])

  useEffect(() => {
    if (!appState) { window.api.loadState() }

    window.api.onLoadStateSuccess((data) => setAppState(data))
  }, [])

  return (
    <div className='grid place-content-center h-screen'>
      <div>
        <div>
          <h1 className='py-2 text-2xl font-bold'>
            Quitting Insights Agent application 
          </h1>

          <p className='py-2 text-lg'>
            Before quitting, please acknowledge and accept the following:
          </p>
          
          <ol className='py-4 pl-10 text-lg list-decimal'>
            <li>By quitting, you will be stopping the data tracking associated with this survey.</li>
            <li>You will not be able to restart the survey once you quit.</li>
            <li>You will be disconnected from the Insights Agent survey.</li>
          </ol>
          
          <p className='py-2 text-lg'>
            By clicking on the "Exit Survey" the Insights Agent application will quit and you will be disconnected from the Insights Agent survey.
          </p>
        </div>

        <div className="float-right pt-8">
          <button
            onClick={continueSurvey}
            className="rounded p-2 h-11 w-40 bg-[#70B443] text-white text-xl font-semibold mr-4"
          >
            Continue
          </button>

          <button
            onClick={window.api.exitSurvey}
            className="rounded p-2 h-11 w-40 bg-red-500 text-white text-xl font-semibold"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExitPage
