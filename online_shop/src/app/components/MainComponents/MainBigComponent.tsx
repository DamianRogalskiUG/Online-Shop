'use client'
import React, { FC, useState, useEffect } from 'react';
import axios, { AxiosResponse} from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import Image from 'next/image';
import { Banner } from 'src/app/models/banner.model';

export const MainBigComponent: FC = () => {
  const [ banners, setBanners ] = useState<Banner[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse = await axios.get('http://localhost:4000/banners');
        if (response.status === 200) {
          setBanners(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
      <>
        {banners ? (<Carousel>
        {banners && banners.map((banner, index) => (
          <Carousel.Item key={banner._id}>
            <Image src={banner.image} alt='banners' width={1500} height={100} />
          </Carousel.Item>
        ))}
        </Carousel>) : (
          <div>Loading...</div>
        )}
      </>
  )
}
