import { Link } from "react-router";
import useCartStore from "../contexts/cartStore";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Button from "../components/ui/Button";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const CartPage = () => {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Keranjang Belanja Anda Kosong</h1>
        <p className="mt-4 text-gray-600">
          Sepertinya Anda belum menambahkan produk apapun.
        </p>
        <Link to="/">
          <Button variant="primary" className="mt-6">
            Mulai Belanja
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.imageUrl || "https://placehold.co/100"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-600">{formatCurrency(item.price)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Pajak (10%)</span>
            <span>{formatCurrency(subtotal * 0.1)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total</span>
            <span>{formatCurrency(subtotal * 1.1)}</span>
          </div>
          <Button variant="primary" className="w-full mt-6">
            Lanjutkan ke Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
