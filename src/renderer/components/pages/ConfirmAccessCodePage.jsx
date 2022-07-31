import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import 'yup-phone';
import { withFormik, Form, Field } from 'formik';
import formStyles from '../styles/forms'

/**
 * Represents the login page for the website
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export function ConfirmAccessCodeForm({ touched, errors }) {
  return (
    <div className="page">
      <Form>
        <div style={formStyles.form}>
          <label htmlFor="email">
            Please enter your verification code
          </label>

          <Field
            type="text"
            role="accessCode"
            name="accessCode"
            placeholder="1234"
            style={formStyles.input}
          />

          { touched.accessCode
              && errors.accessCode
              && <span>{errors.accessCode}</span>
          }

          <div>
            <Link to="/">I did not receive a verification code</Link>
          </div>

          <br/>

          <div>
            <button className={formStyles.button} type="submit">
              Next
            </button>
          </div>
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
export function mapPropsToValues ({ accessCode }) {
  return { accessCode: accessCode || '' }
}

/**
 * Defines the logic for handling form submission
 * Function name matches Formik option key handleSubmit
 * @param {} values - email and password
 * @returns {Response} - fetch response object
 */
export function handleSubmit(values, { props }) {
  props.handleSubmit(values);
}

export const accessCodeValidator = Yup
  .string()
  .required('Please enter your access code');

/**
 * Defines a schema for form validations
 * Constant name matches Formik option key validationSchema
 * @constant
 * @type {object}
 */
export const validationSchema = Yup.object().shape({
  accessCode: accessCodeValidator,
});

export const ConfirmAccessCodeFormWithFormik = withFormik({
  mapPropsToValues,
  handleSubmit,
  validationSchema,
})(ConfirmAccessCodeForm);

function ConfirmAccessCodePage() {
  const navigate = useNavigate();

  function handleSubmit({ accessCode }) {
    window.api.confirmAccessCode(accessCode);
  }

  useEffect(() => {
    window.api.onConfirmAccessCodeSuccess(() => navigate('/setup'));
    window.api.onConfirmAccessCodeError((error) => alert(error));

    return () => window.api.removeAllListeners();
  }, []);

  return (
    <div className="page">
      <ConfirmAccessCodeFormWithFormik
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default ConfirmAccessCodePage
