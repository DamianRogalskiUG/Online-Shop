'use client'
import React, { FC, useLayoutEffect, useState, useContext } from 'react';
import Image from 'next/image';
import { OpinionsComponent } from './OpinionsComponent';
import axios from 'axios';
import { useFormik } from 'formik';
import { LoginContext } from 'src/app/contexts/LoginContext';
import { ProductPageProps } from 'src/app/models/productPageProps.model';
import { IoIosArrowBack } from 'react-icons/io';
import { Delivery } from 'src/app/models/shoppingCart.model';


const ProductPage: FC<ProductPageProps> = ({ _id, image, title, price, long_description, closeFunc }) => {
  const item = { _id, title, image, price };
  const [rating, setRating] = useState(0);
  const [addRating, setAddRating] = useState<boolean | null>(null);
  const { name } = useContext(LoginContext);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const handleAddToCart = async (item: any) => {
    const response = await axios.post('http://localhost:4000/cart', item);
    if (response.data) {
      alert('Product added to cart')
    }
    
  };

  const handleAddRating = async () => {
    await axios.post(`http://localhost:4000/star_rating`, {
      productId: _id,
      rating: formik.values.rating,
    });
    setAddRating(null);
    alert('Rating added');
  }


  useLayoutEffect(() => {
    const handleFetch = async () => {
      const response = await axios.get(`http://localhost:4000/star_rating/${_id}`);
      if (response.data) {
        setRating(response.data.averageRating);
        
      }
      const responseDelivery = await axios.get('http://localhost:4000/deliveries');
      if (responseDelivery.data) {
        setDeliveries(responseDelivery.data);
      }
    };
    handleFetch();
  }, [_id]);

  const formik = useFormik({
    initialValues: {
      rating: '',
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.rating) {
        errors.rating = 'Required';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await axios.post(`http://localhost:4000/star_rating`, {
        productId: _id,
        name: name,
        rating: values.rating,
      });
      alert('Rating added');
      setAddRating(null);
    },
  });


  return (
    <>
    <div className='ProductPage'>
      <button className="Exit" onClick={closeFunc}>
          <IoIosArrowBack />
      </button>
      <div className='productDetails'>
        <div className='productImage'>
        <Image src={image} alt='Product Image' width={500} height={500} />
        </div>
        <div>
          <h1>{title}</h1>
          <div className='product'>
            <h2>{price} PLN</h2>
            {deliveries.length > 0 && (<span className='deliveryEntry'>{((item.price + deliveries[0].price).toFixed(2))} PLN {deliveries[0].title} delivery included</span>)}
            <div className='Delivery'>
                <h4>Available Deliveries</h4>
                {deliveries && deliveries.map((delivery: any) => (
                  <div key={delivery._id}>
                    <span className='deliveryItem'>{delivery.title} - {delivery.price} PLN</span>
                  </div>
                ))}
            </div>
            <span>
              {rating === 0 ? 
              (
                <button className='ratingButton' onClick={() => setAddRating(true)}>
                No Ratings      
                </button>
              ) : (
                <button className='ratingButton' onClick={() => setAddRating(true)}>
                &#9733;&#9733;&#9733;&#9733;&#9733; {(rating.toFixed(2))}       
                </button>
              )}
              {addRating && (
                <form className='ratingForm' onSubmit={formik.handleSubmit}>
                  <input 
                    id='rating'
                    name='rating'
                    type='number' 
                    min='1' 
                    max='5' 
                    onChange={formik.handleChange}
                    value={formik.values.rating}
                  />
                  <button className='ratingSub' type='submit'>Add</button>
                </form>
              )}
            </span>
            <button className='addButton' onClick={() => handleAddToCart(item)}><a>Add to cart</a></button>
          </div>
        </div>
      </div>
      <div className='desc'>
        <span className='longDesc'>{long_description}</span>
      </div>
      <div className='OpinionsContainer'>
        <OpinionsComponent title={title}/>
      </div>
    </div>
    </>
  );
};

export default ProductPage;