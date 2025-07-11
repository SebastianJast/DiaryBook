import React, { useState } from "react";
import "../styles/login.css";
import PropTypes from "prop-types";
import { loginUser } from "../services/list";
import { Link } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function Login({ setToken }) {
  const [validationError, setValidationError] = useState(false);

  let validationSchema = Yup.object({
    email: Yup.string().required("*email is rquired"),
    password: Yup.string().required("*password is required"),
  });

  const handleSubmit = async (e) => {
    const data = await loginUser({
      email: formik.values.email,
      password: formik.values.password,
    });
    setToken(data);

    if (data.error) {
      console.log(data.error);
      setValidationError(data.error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-1">
          <form onSubmit={formik.handleSubmit}>
            <h1>Sign In</h1>
            <label>
              <p>Email</p>
              <input
                type="text"
                name="email"
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email && (
                <p style={{ color: "red" }}>{formik.errors.email}</p>
              )}
            </label>
            <label>
              <p>Password</p>
              <input
                type="password"
                name="password"
                autoComplete="on"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password && (
                <p style={{ color: "red" }}>{formik.errors.password}</p>
              )}
            </label>
            {validationError && (
              <p style={{ color: "red" }}>{validationError}</p>
            )}
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
        <div className="login-card-2">
          <div className="login-card-2-text">
            <h2>DiaryBook</h2>
            <p>
              Welcome to your personal diary. Write freely, reflect deeply, and
              keep your thoughts safe. Log in or sign up to begin your journey.
            </p>
            <Link className="button" to="/Register">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
