import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { withFormik, Form, Field } from 'formik'

/**
 * Represents the login page for the website
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export function VerifySerialNumberForm({ touched, errors }) {
  return (
    <div className="grid place-items-center h-screen">
      <Form>
        <div>
          <button
            type="submit"
            className="rounded w-28 h-11 bg-[#70B443] text-sm "
            onClick={handleConfirmation}
          >
            Get Serial Number
          </button>

          <button
            className="relative float-right top-36 left-20 font-light font-base cursor-pointer underline"
            type="submit"
          >
            Next
          </button>
        </div>
      </Form>
    </div>
  );
}


// export function mapPropsToValues({ phoneNumber }) {
//   return { phoneNumber: phoneNumber || '' }
// }
// export function handleSubmit(values, { props }) {
//   props.handleSubmit(values)
// }
export const VerifySerialNumberFormWithFormik = withFormik({
  // mapPropsToValues,
})(VerifySerialNumberForm);

function handleConfirmation() {
  console.log("this button works")
  //run authentication function
 }

function VerifySerialNumberPage() {
  const navigate = useNavigate()

  function handleSubmitSerial({ serialNumber }) {
    window.api.sendAccessCode(serialNumber) //needs to be changed to reflect current api
  }

  useEffect(() => {
    window.api.onConfirmSerialNumberSuccess(() => navigate("/confirm"));
    window.api.onConfirmSerialNumberError((error) => alert(error));

    // https://patrickpassarella.com/blog/creating-electron-react-app
    return () => window.api.removeAllListeners()
  }, [])

  return (
    <div>
      <VerifySerialNumberFormWithFormik
        handleSubmitSerial={handleSubmitSerial}
      />
    </div>
  );
}

export default VerifySerialNumberPage
