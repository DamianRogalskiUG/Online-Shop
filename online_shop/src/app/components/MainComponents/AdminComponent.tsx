"use client"
import React, { FC } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

export const AdminComponent: FC = () => {
  const formikAdd = useFormik({
    initialValues: {
      title: '',
      image: 'https://cdn.x-kom.pl/placeholder.png',
      price: '',
      short_description: '',
      long_description: '',
      amount: '',
      type: '',

    },
    onSubmit: async (values) => {
      await axios.post('http://localhost:4000/', values);
      alert ('Product added')
    },
  });

  const formikDel = useFormik({
    initialValues: {
      title: '',
    },
    onSubmit: async (values) => {
      const response = await axios.delete('http://localhost:4000/', {data: values});
      if (response.data.deletedCount === 0) {
        alert ('Product not found')
      }
      else {
        alert ('Product deleted')
      }
    },
  })

  const formikEdit = useFormik({
    initialValues: {
      findTitle: '',
      title: '',
      image: 'https://cdn.x-kom.pl/placeholder.png',
      price: '',
      short_description: '',
      long_description: '',
      amount: '',
      type: '',
    },
    onSubmit: async (values) => {
      const response = await axios.put('http://localhost:4000/', values);
      if (response.data === null) {
        alert ('Product not found')
      }
      else {
        alert ('Product edited')
      }
    },
  })

  const formikOpinionDel = useFormik({
    initialValues: {
      _id: '',
    },
    onSubmit: async (values) => {
      const response = await axios.delete('http://localhost:4000/opinions', {data: values});
      if (response.data.deletedCount === 0) {
        alert ('Opinion not found')
      }
      else {
        alert ('Opinion deleted')
      }
    },
  })

  const formikOpinionEdit = useFormik({
    initialValues: {
      _id: '',
      test_opinion: '',
    },
    onSubmit: async (values) => {
      const response = await axios.patch('http://localhost:4000/opinions', values);
      if (response.data === null) {
        alert ('Opinion not found')
      }
      else {
        alert ('Opinion edited')
      }
    },
  });

  const formikRatingDel = useFormik({
    initialValues: {
      _id: '',
    },
    onSubmit: async (values) => {
      const response = await axios.delete('http://localhost:4000/star_rating', {data: values});
      if (response.data.deletedCount === 0) {
        alert ('Rating not found')
      }
      else {
        alert ('Rating deleted')
      }
    },
  })

  const formikRatingEdit = useFormik({
    initialValues: {
      _id: '',
      rating: '',
    },
    onSubmit: async (values) => {
      const response = await axios.patch('http://localhost:4000/star_rating', values);
      if (response.data === null) {
        alert ('Rating not found')
      }
      else {
        alert ('Rating edited')
      }
    },
  });

  return (
    <div className='AdminPanel'>
      <h1>Admin Panel</h1>
      <h2>Products Tools</h2>
      <h2>Add new product</h2>
      <form onSubmit={formikAdd.handleSubmit}>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          name='title'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.title}
        />
        <label htmlFor='title'>Image</label>
        <input
          id='image'
          name='image'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.image}
        />

        <label htmlFor='price'>Price</label>
        <input
          id='price'
          name='price'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.price}
        />

        <label htmlFor='short_description'>Short Description</label>
        <input
          id='short_description'
          name='short_description'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.short_description}
        />

        <label htmlFor='long_description'>Long Description</label>
        <input
          id='long_description'
          name='long_description'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.long_description}
        />

        <label htmlFor='amount'>Amount</label>
        <input
          id='amount'
          name='amount'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.amount}
        />
        <label htmlFor="type">Type</label>
        <input
          id='type'
          name='type'
          type='text'
          onChange={formikAdd.handleChange}
          value={formikAdd.values.type}
        />

        <button type='submit'>Submit</button>
      </form>
      <h2>Remove product</h2>
      <form onSubmit={formikDel.handleSubmit}>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          name='title'
          type='text'
          onChange={formikDel.handleChange}
          value={formikDel.values.title}
        />

        <button type='submit'>Submit</button>
      </form>
      <h2>Edit product</h2>
      <form onSubmit={formikEdit.handleSubmit}>
        <label htmlFor='findTitle'>Product to edit</label>
        <input
          id='findTitle'
          name='findTitle'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.findTitle}
        />

        <label htmlFor='title'>Title</label>
        <input
          id='title'
          name='title'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.title}
        />

        <label htmlFor="image">Image</label>
        <input
          id='image'
          name='image'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.image}
        />

        <label htmlFor='price'>Price</label>
        <input
          id='price'
          name='price'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.price}
        />

        <label htmlFor='short_description'>Short Description</label>
        <input
          id='short_description'
          name='short_description'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.short_description}
        />

        <label htmlFor='long_description'>Long Description</label>
        <input
          id='long_description'
          name='long_description'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.long_description}
        />

        <label htmlFor='amount'>Amount</label>
        <input
          id='amount'
          name='amount'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.amount}
        />
        <label htmlFor="type">Type</label>
        <input
          id='type'
          name='type'
          type='text'
          onChange={formikEdit.handleChange}
          value={formikEdit.values.type}
        />

        <button type='submit'>Submit</button>
      </form>

      <h2>Opinions Tools</h2>
      <h2>Delete opinion</h2>
      <form onSubmit={formikOpinionDel.handleSubmit}>
        <label htmlFor='_id'>_id</label>
        <input
          id='_id'
          name='_id'
          type='text'
          onChange={formikOpinionDel.handleChange}
          value={formikOpinionDel.values._id}
        />

        <button type='submit'>Submit</button>
      </form>
      <h2>Edit opinion</h2>
      <form onSubmit={formikOpinionEdit.handleSubmit}>
        <label htmlFor='_id'>_id</label>
          <input
            id='_id'
            name='_id'
            type='text'
            onChange={formikOpinionEdit.handleChange}
            value={formikOpinionEdit.values._id}
          />
        <label htmlFor='test_opinion'>Opinion</label>
          <input
            id='test_opinion'
            name='test_opinion'
            type='text'
            onChange={formikOpinionEdit.handleChange}
            value={formikOpinionEdit.values.test_opinion}
          />

        <button type='submit'>Submit</button>
      </form>
      <h2>Rating Tools</h2>
      <h2>Delete Rating</h2>
      <form onSubmit={formikRatingDel.handleSubmit}>
        <label htmlFor='_id'>_id</label>
        <input
          id='_id'
          name='_id'
          type='text'
          onChange={formikRatingDel.handleChange}
          value={formikRatingDel.values._id}
        />

        <button type='submit'>Submit</button>
      </form>
      <h2>Edit Rating</h2>
      <form onSubmit={formikRatingEdit.handleSubmit}>
        <label htmlFor='_id'>_id</label>
          <input
            id='_id'
            name='_id'
            type='text'
            onChange={formikRatingEdit.handleChange}
            value={formikRatingEdit.values._id}
          />
        <label htmlFor='rating'>Rating</label>
          <input
            id='rating'
            name='rating'
            type='number'
            onChange={formikRatingEdit.handleChange}
            value={formikRatingEdit.values.rating}
          />

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};