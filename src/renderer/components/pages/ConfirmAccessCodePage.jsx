import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import 'yup-phone';
import { withFormik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';

/**
 * Represents the login page for the website
 * @param {Object} props
 * @returns {React.ReactElement}
 */
export function ConfirmAccessCodeForm({ touched, errors }) {
  const { t } = useTranslation();
  
  return (
    <div className='grid place-items-center h-screen'>
      <Form>
        <div>
          <label htmlFor="email">
            {t('confirmation.code')}
          </label>

          <div className='grid place-items-center'>
            <Field
              type="text"
              role="accessCode"
              name="accessCode"
              placeholder="XXXXXX"
              className="w-96 py-2 pl-2 m-0 rounded-lg text-left text-desktopBgBlack"
            />

            { touched.accessCode
                && errors.accessCode
                && <span>{errors.accessCode}</span>
            }

            <div className='pt-8'>
              <Link to="/">{t('noVerfication')}</Link>
            </div>
          </div>

          <br/>

          <div>
            <button type="submit" className='relative float-right top-20 left-20 font-light font-base cursor-pointer underline'>
              {t('next')}
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
