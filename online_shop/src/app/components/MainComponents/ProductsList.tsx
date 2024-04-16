'use client'
import React, { FC, useEffect, useContext, useState } from "react";
import axios, {AxiosResponse} from "axios";
import { SelectedProductContext } from 'src/app/contexts/SelectedProductContext';
import { ProductListContext } from 'src/app/contexts/ProductListContext';
import { SelectedTitleContext } from 'src/app/contexts/SelectedTitleContext';
import { ShoppingCartContext } from 'src/app/contexts/ShoppingCartContext';
import { ShoppingCart } from '../TopComponents/ShoppingCart';
import Image from "next/image";
import { Product } from 'src/app/models/product.model';
import { ProductsListProps } from 'src/app/models/productsListProps.model';
import { IoIosArrowBack } from "react-icons/io";
import { Delivery } from 'src/app/models/shoppingCart.model';

export const ProductsListComponent: FC<ProductsListProps> = ({ closeFunc }) => {
  const { setSelectedProduct } = useContext(SelectedProductContext);
  const { productList } = useContext(ProductListContext);
  const { selectedTitle, setSelectedTitle } = useContext(SelectedTitleContext);
  const { isCartOpen } = useContext(ShoppingCartContext);
  const [data, setData] = useState<Product[] | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);


  useEffect(() => {
    const fetchData = () => {
      try {
        const searchParams = {
          title: selectedTitle,
          sortBy: sortBy,
          minPrice: minPrice,
          maxPrice: maxPrice,
        };
  
        const productPromise = productList === 'all'
          ? axios.get('http://localhost:4000/search', { params: searchParams })
          : axios.get('http://localhost:4000/search', { params: { ...searchParams, type: productList } });
  
        const deliveryPromise = axios.get('http://localhost:4000/deliveries');
  
        Promise.all([productPromise, deliveryPromise])
          .then(([productResponse, deliveryResponse]) => {
            setData(productResponse.data);
            if (productResponse.data.length > 0) {
              setSelectedProduct(null);
            }
  
            if (deliveryResponse.data) {
              setDeliveries(deliveryResponse.data);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [productList, setSelectedProduct, sortBy, selectedTitle, setSelectedTitle, maxPrice, minPrice]);
  
  const handleInfoClick = (product: Product): void => {
    setSelectedProduct(product);
  };
  

  return (
    <>
    {isCartOpen && !productList ? (
      <ShoppingCart />
    ) : (
      <div className="ProductsListContainer">
      <button className="Exit" onClick={closeFunc}>
        <IoIosArrowBack />
      </button>
      <div>
      <div className="FilterBar">
        <ul className="filter">
          <button onClick={() => setSortBy('')}>Default</button>
          <button onClick={() => setSortBy('asc')}>Lowest Price</button>
          <button onClick={() => setSortBy('desc')}>Highest Price</button>
          <button onClick={() => setSortBy('avgRating')}>Average Rating</button>
          <div>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value !== '' ? parseFloat(e.target.value) : null)}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value !== '' ? parseFloat(e.target.value) : null)}
            />
          </div>
        </ul>
      </div>
      <div className="ProductsList">
        {data && data.map((item) => (
          <div key={item._id} onClick={() => handleInfoClick(item)}>
            <Image src={item.image} alt="Product Image" width={200} height={200} />
            <span>
              <h3>{item.title}</h3>
              <span>
                <h4>{item.price} PLN</h4>
                {deliveries.length > 0 && (<span>{((item.price + deliveries[0].price).toFixed(2))} PLN {deliveries[0].title} delivery included</span>)}
                <span>Available units: {item.amount}</span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
    </div>
    )}
  </>
  );
};