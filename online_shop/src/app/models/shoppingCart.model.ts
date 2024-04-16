export interface Item {
    _id: string;
    title: string;
    image: string;
    price: number;
    amount: number;
}
  
export interface Order {
    _id: string;
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    delivery: string;
    deliveryPrice: number;
    payment: string;
    products: Order[] | string;
    price: number;
  }
  
export interface Delivery {
    _id: string;
    title: string;
    price: number;
  }
  
export interface SelectedDelivery {
    title: string;
    price: number;
}