import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'

function ExitPage() {
  const navigate = useNavigate()

  function exitSurvey() {
    window.api.exitSurvey()
  }

  function continueSurvey() {
    console.log(window.api.onboardingStep)
    if (window.api.onboardingStep === 'DASHBOARD') {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }

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
            className="rounded p-2 h-11 bg-[#70B443] text-white text-xl font-semibold"
          >
            Continue Survey
          </button>
          <button
            onClick={exitSurvey}
            className="rounded p-2 h-11 bg-red-500 text-white text-xl font-semibold"
          >
            Exit Survey
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExitPage
