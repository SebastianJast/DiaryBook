import React, { useState } from "react";
import "../styles/register.css";
import { addUser } from "../services/list";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import useToken from "./useToken";

export default function Register() {
  const [validationError, setValidationError] = useState(false);
  const { setToken } = useToken();

  const navigate = useNavigate();
  let validationSchema = Yup.object({
    username: Yup.string()
      .required("*username is rquired")
      .min(3, "Username must be at least 3 characters")
      .max(25, "Username must be at most 25 characters"),

    email: Yup.string()
      .required("*email is rquired")
      .matches(/@/, "Email must have @ character")
      .min(3, "Email must be at least 3 characters")
      .max(25, "Email must be at most 25 characters"),

    password: Yup.string()
      .required("*password is required")
      .matches(/^[A-Z]/, "Password must start with capital letter")
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password must be at most 25 characters"),

    confirmPassword: Yup.string()
      .required("*please retype your password")
      .oneOf([Yup.ref("password")], "Your password do not match"),
  });

  const handleSubmit = async (e) => {
    const data = await addUser({
      username: formik.values.username,
      email: formik.values.email,
      password: formik.values.password,
    });
    setToken(data);

    if (data.error) {
      console.log(data.error);
      setValidationError(data.error);
    } else {
      navigate("/");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-card-1">
          <form onSubmit={formik.handleSubmit}>
            <h1>Sign Up</h1>
            <label>
              <p>Username</p>
              <input
                type="text"
                name="username"
                id="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.errors.username && formik.touched.username && (
                <p style={{ color: "red" }}>{formik.errors.username}</p>
              )}
            </label>
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
            <label>
              <p>Confirm Password</p>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="on"
                id="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <p style={{ color: "red" }}>
                    {formik.errors.confirmPassword}
                  </p>
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
        <div className="register-card-2">
          <div className="register-card-2-text">
            <h2>QuoteBook</h2>
            <p>
              The most beautiful thoughts from books in one place. Sign In and
              dive into literature!
            </p>
            <Link className="button" to="/">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
