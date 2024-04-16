'use client'
import React, { FC, useContext, useEffect, useState, useMemo } from 'react';
import { ShoppingCartContext } from 'src/app/contexts/ShoppingCartContext';
import axios from 'axios';
import { useFormik } from 'formik';
import Image from 'next/image';
import { LoginContext } from 'src/app/contexts/LoginContext';
import * as Yup from 'yup';
import { Item, Order, Delivery, SelectedDelivery } from 'src/app/models/shoppingCart.model';
import { IoIosArrowBack } from "react-icons/io";
import { animateScroll as scroll } from 'react-scroll';




export const ShoppingCart: FC = () => {
  const { closeCart } = useContext(ShoppingCartContext);
  const [items, setItems] = useState<Item[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[] | undefined>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<SelectedDelivery>({ title: '', price: 0 });
  const [ordering, setOrdering] = useState(false);
  const { isLoggedIn } = useContext(LoginContext);
  const [orders, setOrders] = useState<Order[]>([]);


  const fetchCart = async () => {
    const response = await axios.get('http://localhost:4000/cart');
    setItems(response.data);
    const responseDelivery = await axios.get('http://localhost:4000/deliveries');
    setDeliveries(responseDelivery.data);
    if (isLoggedIn) {
      const responseOrders = await axios.get(`http://localhost:4000/orders/${isLoggedIn}`);
      setOrders(responseOrders.data);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);


  const handleAddToCart = async (item: Item) => {
    const response = await axios.post('http://localhost:4000/cart', item);
    console.log(response);
    if (response.data) {
      fetchCart();
    }
  }

  const handleDeleteFromCart = async (item: Item) => {
    const { data } = await axios.delete(`http://localhost:4000/cart/${item._id}`);
    if (data) {
      fetchCart();
    }
  }

  
  const handlePurchase = () => {
    setOrdering(true);
    scroll.scrollToBottom();
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required'),
    surname: Yup.string()
      .required('Surname is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required'),
    address: Yup.string()
      .required('Address is required'),
    city: Yup.string()
      .required('City is required'),
    zipCode: Yup.string()
      .required('Zip Code is required'),
    delivery: Yup.string()
      .required('Delivery is required'),
    payment: Yup.string()
      .required('Payment method is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      delivery: '',
      deliveryType: '',
      payment: '',
      products: '',
      price: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await axios.post(`http://localhost:4000/orders`, {
        name: values.name,
        surname: values.surname,
        phoneNumber: values.phone,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        delivery: selectedDelivery.title,
        deliveryPrice: selectedDelivery.price,
        payment: values.payment,
        products: items,
        price: totalSum
      });
      alert('Order sent');
    },
  });

  const totalSum = useMemo(() => {
    const deliveryPrice = selectedDelivery ? selectedDelivery.price : 0;

    return items.reduce((sum, item) => sum + item.price * item.amount, 0) + deliveryPrice;
  }, [items, selectedDelivery]);

  return (
    <div className='ShoppingCartContainer'>
    <button className='Exit' onClick={closeCart}><IoIosArrowBack /></button>
    <div className='ShoppingCart'>
    <div>
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (<p>Cart is empty</p>) : (
        <p>Items in cart: {items.reduce((totalQuantity, item) => totalQuantity + item.amount, 0)}</p>
      )}
      <ul>
        {items && items.map((item) => (
          <li key={item._id}>
            <div>
              <Image src={item.image} alt='Product Image' width={200} height={200} />
            </div>
            <span>
              <h2>{item.title}</h2>
              <p>Price: {item.price} PLN</p>
              <p>Amount: {item.amount}</p>
              <div>
                <button onClick={() => handleAddToCart(item)}>+</button>
                <button onClick={() => handleDeleteFromCart(item)}>-</button>
              </div>
            </span>
          </li>
        ))}
      </ul>
      <div className='sum'>
        <h2>Total Sum: {totalSum.toFixed(2)} PLN</h2>
        { !isLoggedIn ? (
            <p>You have to be logged-in to place an order</p>
        ) : (
            <>
            <h3>Your Orders</h3>
            <ul>
              {orders && orders.map((order) => (
                <li key={order._id}>
                  {order.products && order.products.length > 1 ? (
                    <span>Order {order._id} - {order.products.length} products - {(order.price).toFixed(2)} PLN</span>
                  ) : (
                    <span>Order {order._id} - {order.products.length} product - {(order.price).toFixed(2)} PLN</span>
                  )}
                </li>
              ))}
            </ul>
            {!ordering && <button onClick={() => handlePurchase()}>Purchase</button>}
            </>
            )}
      </div>
      {ordering && (
        <div className='orderContainer'>
          <h2>Ordering</h2>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <input 
              id='name'
              name='name'
              type='text' 
              placeholder='Name'
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
            />
            <label htmlFor="surname">Surname</label>
            <input 
              id='surname'
              name='surname'
              type='text' 
              placeholder='Surname'
              onChange={formik.handleChange}
              value={formik.values.surname}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="email">Email</label>
            <input 
              id='email'
              name='email'
              type='email' 
              placeholder='Email'
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="phone">Phone Number</label>
            <input 
              id='phone'
              name='phone'
              type='text' 
              placeholder='Phone Number'
              onChange={formik.handleChange}
              value={formik.values.phone}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="address">Address</label>
            <input 
              id='address'
              name='address'
              type='text' 
              placeholder='Address'
              onChange={formik.handleChange}
              value={formik.values.address}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="city">City</label>
            <input 
              id='city'
              name='city'
              type='text' 
              placeholder='City'
              onChange={formik.handleChange}
              value={formik.values.city}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="zipCode">Zip Code</label>
            <input 
              id='zipCode'
              name='zipCode'
              type='text' 
              placeholder='Zip Code'
              onChange={formik.handleChange}
              value={formik.values.zipCode}
              onBlur={formik.handleBlur}

            />
            <label htmlFor="delivery">Delivery</label>
            {deliveries && (
              <select
                id='delivery'
                name='delivery'
                onChange={(e) => {
                  const selectedDelivery = deliveries.find(delivery => delivery._id === e.target.value);
                  if (selectedDelivery) {
                    setSelectedDelivery(selectedDelivery);
                  }
                  formik.handleChange(e);
                }}
                value={formik.values.delivery}
              >
                <option value=''>Select delivery</option>
                {deliveries.map((delivery) => (
                  <option key={delivery._id} value={delivery._id}>{delivery.title} - {delivery.price} PLN</option>
                ))}
              </select>
            )}
            <label htmlFor="payment">Payment</label>
            <select 
              id='payment'
              name='payment'
              onChange={formik.handleChange}
              value={formik.values.payment}
              onBlur={formik.handleBlur}

            >
              <option value=''>Select payment</option>
              <option value='1'>Online Payment</option>
              <option value='2'>Credit Card</option>
              <option value='3'>Cash</option>
            </select>
            <div className='errors'>
            {formik.touched.name && formik.errors.name ? (
              <div>{formik.errors.name}</div>
             ) : null}
            {formik.touched.surname && formik.errors.surname ? (
              <div>{formik.errors.surname}</div>
            ) : null}
            {formik.touched.email && formik.errors.email ? (
              <div>{formik.errors.email}</div>
            ) : null}
            {formik.touched.phone && formik.errors.phone ? (
              <div>{formik.errors.phone}</div>
            ) : null}
            {formik.touched.address && formik.errors.address ? (
              <div>{formik.errors.address}</div>
            ) : null}
            {formik.touched.city && formik.errors.city ? (
              <div>{formik.errors.city}</div>
            ) : null}
            {formik.touched.zipCode && formik.errors.zipCode ? (
              <div>{formik.errors.zipCode}</div>
            ) : null}
            {formik.touched.delivery && formik.errors.delivery ? (
              <div>{formik.errors.delivery}</div>
            ) : null}
            </div>

            <button type='submit'>Order</button>
          </form>
        </div>
      )}
      </div>
    </div>
    </div>
  )
};
