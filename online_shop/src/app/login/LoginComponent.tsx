'use client'
import React, { FC, useContext, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginContext } from '../contexts/LoginContext';
import Link from 'next/link';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { DarkModeContextType } from '../models/darkModeContext.model';


interface LoginFormValues {
    email: string;
    password: string;
  }
  
export const LoginComponent: FC = () => {
    const { login, isLoggedIn } = useContext(LoginContext);
    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const { isDarkMode } = useContext<DarkModeContextType | null>(DarkModeContext)!;

    const initialValues: LoginFormValues = {
      email: '',
      password: '',
    };
  
    const handleSubmit = async (values: LoginFormValues) => {
      await login(values);

    };
  
    const validationSchema = Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    });
  
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: handleSubmit,
    });

    useEffect(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, []);
  
    return (
      <div className={`LoginComponent ${isDarkMode ? 'darkMode' : 'lightMode'}`}>
            <h1 className="m-10 text-5xl font-bold">Login</h1>
        <form onSubmit={formik.handleSubmit}>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              ref={emailInputRef}
            />
          </div>
  
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          {!isLoggedIn && (
            <button type="submit">Login</button>
          )}
          {isLoggedIn && (
            <button>
              <Link href={"/"}>Go To Main Page</Link>
            </button>
          )}
        </form>
        </div>
    );
  };
  