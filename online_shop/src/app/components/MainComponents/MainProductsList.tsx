'use client'
import React, { useEffect, useReducer, FC, useContext, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Image from 'next/image';
import { MainBigComponent } from './MainBigComponent'
import { SelectedProductContext } from 'src/app/contexts/SelectedProductContext';
import { ProductListContext } from 'src/app/contexts/ProductListContext';
import { ProductsListComponent } from './ProductsList';
import ProductPage from './ProductPageComponent';
import { LoginContext } from 'src/app/contexts/LoginContext';
import { AdminComponent } from './AdminComponent';
import { ShoppingCartContext } from 'src/app/contexts/ShoppingCartContext';
import { ShoppingCart } from '../TopComponents/ShoppingCart';
import { Product } from 'src/app/models/product.model';
import { Item, Delivery } from 'src/app/models/shoppingCart.model';
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

type State = {
  data: Product[];
  selectedProductMain: Product | null;
  startIndex: number;
};

type Action =
  | { type: 'SET_DATA'; payload: Product[] }
  | { type: 'SELECT_PRODUCT'; payload: Product }
  | { type: 'CLOSE_PRODUCT' }
  | { type: 'NEXT_SET_OF_PRODUCTS' }
  | { type: 'PREVIOUS_SET_OF_PRODUCTS' };

const initialState: State = {
  data: [],
  selectedProductMain: null,
  startIndex: 0,
};


const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SELECT_PRODUCT':
      return { ...state, selectedProductMain: action.payload };
    case 'CLOSE_PRODUCT':
      return { ...state, selectedProductMain: null };
    case 'NEXT_SET_OF_PRODUCTS':
      return { ...state, startIndex: Math.max(state.startIndex + 3, 6) };
    case 'PREVIOUS_SET_OF_PRODUCTS':
      return { ...state, startIndex: Math.max(state.startIndex - 3, 0) };
    default:
      return state;
  }
};


export const MainProductsList: FC = () => {
  const { selectedProduct, setSelectedProduct } = useContext(SelectedProductContext);
  const { productList, setProductList } = useContext(ProductListContext);
  const { isCartOpen } = useContext(ShoppingCartContext);
  const { isAdmin } = useContext(LoginContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [ delivery, setDelivery ] = useState<Delivery>({ _id: '', title: '', price: 0});
  const { data, selectedProductMain, startIndex } = state;
  const [desc , setDesc] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<Product[]> = await axios.get('http://localhost:4000/');
        const delivery: AxiosResponse<Delivery[]> = await axios.get('http://localhost:4000/deliveries');
        console.log(delivery.data[0].price)
        dispatch({ type: 'SET_DATA', payload: response.data });
        setLoading(true);
        if (response.data.length > 0) {
          setSelectedProduct(null);
        }
        if (delivery.data) {
          setDelivery(delivery.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setSelectedProduct, setDelivery]);

  const handleInfoClick = (product: Product): void => {
    dispatch({ type: 'SELECT_PRODUCT', payload: product });
  };

  const handleCloseInfo = (): void  => {
    dispatch({ type: 'CLOSE_PRODUCT' });
    setSelectedProduct(null)
    setProductList(null)
  };

  const handleAddToCart = async (item: Product)  => {
    const value: Item = {
      _id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      amount: 1
    }
    const response= await axios.post('http://localhost:4000/cart', value);
    if (response.data) {
      alert('Product added to cart')
    }
  }

  const handleNext = (): void  => {
    dispatch({ type: 'NEXT_SET_OF_PRODUCTS' });
  };

  const handlePrevious = (): void  => {
    dispatch({ type: 'PREVIOUS_SET_OF_PRODUCTS' });
  };

  return (
    <div className='styles.MainComponentContainer'>
      {isAdmin && (
        <AdminComponent />
      )}
      {isCartOpen && !productList && !selectedProduct ? (
        <ShoppingCart />
      ) : (
      <>
      {productList && !selectedProduct ? (
        <ProductsListComponent 

          closeFunc={handleCloseInfo} />
      ): (
        <>
        {!selectedProductMain && !selectedProduct && (
          <div className='MainRow1'>
            <MainBigComponent />
          </div>
        )}
        {selectedProduct && (
          <>
            <ProductPage 
              _id={selectedProduct._id}
              image={selectedProduct.image}
              title={selectedProduct.title} 
              price={selectedProduct.price}
              long_description={selectedProduct.long_description}
              closeFunc={handleCloseInfo}
              handleAddToCart={handleAddToCart}
            />
          </>
        )}
        {selectedProductMain && !selectedProduct && (
          <>
            <ProductPage 
              _id={selectedProductMain._id}
              image={selectedProductMain.image}
              title={selectedProductMain.title} 
              price={selectedProductMain.price}
              long_description={selectedProductMain.long_description}
              closeFunc={handleCloseInfo}
              handleAddToCart={handleAddToCart}
              />
          </>
        )}

        {!productList && !selectedProductMain && !selectedProduct && (
          <div className='MainRow2'>
            {(startIndex !== 0)? (
              <button 
                onClick={handlePrevious}
                className='handleButtons'
              >
                <IoIosArrowBack />
              </button>
            ) : (
              <button className='hidden'></button>
            )}
            <ul>
              {data && data.slice(startIndex, startIndex + 3).map((item) => (
                <li key={item._id}>
                  <div className='imageContainer'>
                    <Image src={item.image} alt='Product Image' width={150} height={150} />
                  </div>
                  <div>
                    <span>{item.title}</span>
                    <span>{item.price} PLN</span>
                    {item && <span>{((item.price + delivery.price).toFixed(2))} PLN {delivery.title} delivery included</span>}
                    <span>Available units: {item.amount}</span>
                    <span>
                      {!desc && item.short_description? (
                        item.short_description.slice(0, 14)
                      ) : (
                        item.short_description  
                      )}
                    </span>
                    <button 
                        onClick={() => setDesc(!desc)}
                        className='text-gray-500'
                      >
                        {desc ? 'Show less' : 'Show more'}
                      </button>
                    {!desc && <div className='adder'>
                    <button onClick={() => handleInfoClick(item)}>Details</button>
                    <button onClick={() => handleAddToCart(item)}><i className="gg-shopping-cart"></i></button>
                    </div>}
                  </div>
                </li>
              ))}
            </ul>
            {loading && (startIndex < 9)? (
              <button 
                onClick={handleNext}
                className='handleButtons'
              >
                <IoIosArrowForward />
              </button>
            ) : (
              <button className='hidden'></button>
            )}
          </div>
        )}
        </>
        )}
      </>
      )}
    </div>
  );
};