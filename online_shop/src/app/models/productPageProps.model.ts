export interface ProductPageProps {
    _id: string;
    image: string;
    title: string;
    price: number;
    long_description: string;
    closeFunc: () => void;
    handleAddToCart: (item: any) => void;
}