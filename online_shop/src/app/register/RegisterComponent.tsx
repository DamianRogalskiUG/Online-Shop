'use client'
import React, { FC, useContext, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginContext } from '../contexts/LoginContext';
import Link from 'next/link';
import { DarkModeContext } from '../contexts/DarkModeContext';
import { DarkModeContextType } from '../models/darkModeContext.model';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
  }
  
export const RegisterComponent: FC = () => {
    const { register, isLoggedIn } = useContext(LoginContext);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const { isDarkMode } = useContext<DarkModeContextType | null>(DarkModeContext)!;


    const initialValues: RegisterFormValues = {
      name: '',
      email: '',
      password: '',
    };
  
    const handleSubmit = async (values: RegisterFormValues) => {
      await register(values);
    
    };
  
    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    });
  
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: handleSubmit,
    });

    useEffect(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, []);
  
    return (
      <div className={`LoginComponent ${isDarkMode ? 'darkMode' : 'lightMode'}`}>
            <h1 className="m-10 text-5xl font-bold">Register</h1>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="name"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              ref={nameInputRef}
              onBlur={formik.handleBlur}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
          </div>
  
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          {!isLoggedIn && (
          <button type="submit">Register</button>
          )}
          {isLoggedIn && (
            <div>
              <Link href={"/"}>Go To Main Page</Link>
            </div>
          )}
        </form>
        </div>
    );
  };
  