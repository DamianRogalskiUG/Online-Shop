'use client'
import React, { FC, useContext } from "react";
import { useFormik } from "formik";
import { SelectedTitleContext } from "src/app/contexts/SelectedTitleContext";
import { ProductListContext } from "src/app/contexts/ProductListContext";

export const SearchBarComponent: FC = () => {
  const { setSelectedTitle } = useContext(SelectedTitleContext);
  const { setProductList } = useContext(ProductListContext);

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    onSubmit: (values) => {
      setSelectedTitle(values.title);
      setProductList('all');
    },
  });



  return (
    <form className='SearchBar' onSubmit={formik.handleSubmit}>
        <input 
            type="text"
            name='title'
            id='title'
            placeholder="Search..."
            onChange={formik.handleChange}
            value={formik.values.title}
        />
        <button type='submit'>
          <i className="gg-search"></i>        
        </button>
    </form>
  );
};