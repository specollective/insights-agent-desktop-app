import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import 'yup-phone';
// import { withFormik, Form, Field } from 'formik';

/**
 * Represents the login page for the website
 * @param {Object} props
 * @returns {React.ReactElement}
 */
// export function TechnicialSetupPage({ touched, errors }) {
//   return (
//     <h1>Hello World!</h1>
//   )
// }

// /**
//  * Defines a function to map Formik props to form values
//  * Function name matches Formik option key mapPropsToValues
//  * @param {} props - includes email and password
//  * @returns {object} - formatted field values
//  */
// export function mapPropsToValues ({ accessCode }) {
//   return { accessCode: accessCode || '' }
// }

// /**
//  * Defines the logic for handling form submission
//  * Function name matches Formik option key handleSubmit
//  * @param {} values - email and password
//  * @returns {Response} - fetch response object
//  */
// export function handleSubmit(values, { props }) {
//   props.handleSubmit(values);
// }

// export const accessCodeValidator = Yup
//   .string()
//   .required('Please enter your access code');

// /**
//  * Defines a schema for form validations
//  * Constant name matches Formik option key validationSchema
//  * @constant
//  * @type {object}
//  */
// export const validationSchema = Yup.object().shape({
//   accessCode: accessCodeValidator,
// });

// export const ConfirmAccessCodeFormWithFormik = withFormik({
//   mapPropsToValues,
//   handleSubmit,
//   validationSchema,
// })(ConfirmAccessCodeForm);

function TechnicianSetupPage() {
  // const navigate = useNavigate();

  // function handleSubmit({ accessCode }) {
  //   window.api.confirmAccessCode(accessCode);
  // }

  // useEffect(() => {
  //   window.api.onConfirmAccessCodeSuccess(() => navigate('/setup'));
  //   window.api.onConfirmAccessCodeError((error) => alert(error));

  //   return () => window.api.removeAllListeners();
  // }, []);

  return (
    <div className="page">
      <h1>Hello world!</h1>
    </div>
  )
}

export default TechnicianSetupPage;
