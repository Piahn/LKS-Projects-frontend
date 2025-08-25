import { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import ProductCard from "../components/features/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data.data);
      } catch (err) {
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali saat komponen dimuat

  // Tampilan saat loading
  if (loading) {
    return <div className="text-center">Memuat produk...</div>;
  }

  // Tampilan saat terjadi error
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Jelajahi Produk Kami</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
