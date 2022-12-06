import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import 'yup-phone'
// import formStyles from '../styles/forms'

/**
 * Represents the login page for the website
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export function SendAccessCodeForm({ touched, errors }) {
  return (
    <div className='grid place-items-center h-screen'>
      <Form>
        <div>
          <label htmlFor='phoneNumber'>Please enter your phone number:</label>

          <div className='grid place-items-center'>
            <Field
              id='phoneNumber'
              type='text'
              role='phoneNumber'
              name='phoneNumber'
              data-test-id='phone-number'
              placeholder='(XXX) XXX-XXXX'
              className="w-96 py-2 m-0 rounded-lg text-left"
            />

            {touched.phoneNumber && errors.phoneNumber && (
              <div>{errors.phoneNumber}</div>
            )}
          </div>

          <button className='float-right' type='submit'>
            Next
          </button>
        </div>
      </Form>
    </div>
  )
}

/**
 * Defines a function to map Formik props to form values
 * Function name matches Formik option key mapPropsToValues
 * @param {} props - includes email and password
 * @returns {object} - formatted field values
 */
export function mapPropsToValues({ phoneNumber }) {
  return { phoneNumber: phoneNumber || '' }
}

/**
 * Defines the logic for handling form submission
 * Function name matches Formik option key handleSubmit
 * @param {} values - email and password
 * @returns {Response} - fetch response object
 */
export function handleSubmit(values, { props }) {
  props.handleSubmit(values)
}

export const phoneNumberValidator = Yup.string()
  .required('Phone number is required')
  .phone('USA', true, 'Phone number is invalid')

/**
 * Defines a schema for form validations
 * Constant name matches Formik option key validationSchema
 * @constant
 * @type {object}
 */
export const validationSchema = Yup.object().shape({
  phoneNumber: phoneNumberValidator,
})

/**
 * Wraps SendAccessCodeForm with the withFormik Higher-order component
 */
export const SendAccessCodeFormWithFormik = withFormik({
  mapPropsToValues,
  handleSubmit,
  validationSchema,
})(SendAccessCodeForm)

/**
 * Represents page for sending an access code.
 * @param {Object} props
 * @returns {React.ReactElement}
 */
function SendAccessCodePage() {
  const navigate = useNavigate()

  function handleSubmit({ phoneNumber }) {
    window.api.sendAccessCode(phoneNumber)
  }

  useEffect(() => {
    window.api.onSendAccessCodeSuccess(() => navigate('/confirm'))
    window.api.onSendAccessCodeError((error) => alert(error))

    // https://patrickpassarella.com/blog/creating-electron-react-app
    return () => window.api.removeAllListeners()
  }, [])

  return (
    <div>
      <SendAccessCodeFormWithFormik handleSubmit={handleSubmit} />
    </div>
  )
}

export default SendAccessCodePage
