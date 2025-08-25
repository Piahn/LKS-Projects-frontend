import Button from "../ui/Button";
import useCartStore from "../../contexts/cartStore";

const ProductCard = ({ product }) => {
  const { name, price, category, imageUrl } = product;
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
      <img
        src={imageUrl || "https://placehold.co/300"} // Gambar placeholder jika tidak ada
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {category?.name || "Uncategorized"}
        </p>
        <p className="text-xl font-bold text-blue-600 mb-4">
          {formatCurrency(price)}
        </p>
        <Button variant="primary" className="w-full" onClick={handleAddToCart}>
          Tambah ke Keranjang
        </Button>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default ProductCard;
