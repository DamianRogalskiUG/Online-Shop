'use client'
import React, { FC, useEffect, useState, useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LoginContext } from 'src/app/contexts/LoginContext';
import { Opinion } from 'src/app/models/opinion.model';
import { OpinionsProps } from 'src/app/models/opinionsProps.model';


export const OpinionsComponent: FC<OpinionsProps> = ({title}) => {
  const [response, setResponse] = useState<Opinion[]>([]);
  const { isLoggedIn, name, isAdmin } = useContext(LoginContext);
  const [sent, setSent] = useState(false);

  const validationSchema = Yup.object({
    opinion: Yup.string().required('Opinion is required'),
  });

  const formik = useFormik({
    initialValues: {
      opinion: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response: AxiosResponse<Opinion> = await axios.post('http://localhost:4000/opinions', {
          nick: name,
          title: title,
          opinion: values.opinion,
        });
        setResponse(prevResponse => [...prevResponse, response.data]);
        if (response.status === 200) {
          setSent(true);
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    },
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<Opinion[]> = await axios.get('http://localhost:4000/opinions');
        setResponse(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='OpinionsComponentContainer'>
      <h2>Opinions</h2>
      {isLoggedIn && (
      <div className='OpinionAdder'>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="opinion"
            id="opinion"
            placeholder='Leave your opinion on a product'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.opinion}
          />
          {formik.touched.opinion && formik.errors.opinion ? (
            <div>{formik.errors.opinion}</div>
          ) : null}
          <button type="submit">Send Opinion</button>
          {sent && <a>Opinion added</a>}
        </form>
      </div>
      )}
      
      {response.map(opinion => (
        opinion.title === title && (
          <div className='opinion' key={opinion._id}>
            <h3>{opinion.nick}</h3>
            {isAdmin && (
              <p>{opinion._id}</p>
            )}
            <p>{opinion.opinion}</p>
          </div>
        )
      ))}
    </div>
  );
};