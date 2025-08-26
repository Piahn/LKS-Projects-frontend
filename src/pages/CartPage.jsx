import { Link, useNavigate } from "react-router";
import { FiPlus, FiMinus, FiTrash2, FiTag } from "react-icons/fi";
import toast from "react-hot-toast";
import { useState } from "react";

// Custom Hooks
import useCartStore from "../contexts/cartStore";
import axiosInstance from "../services/api";
import useAuthStore from "../contexts/authStore";

// Components
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  // Logika Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Silakan masukkan kode kupon.");
      return;
    }
    try {
      // Kita ambil semua kupon milik user untuk validasi
      const response = await axiosInstance.get("/coupons");
      const userCoupons = response.data.data;
      const coupon = userCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase()
      );

      if (coupon && coupon.is_active) {
        let calculatedDiscount = 0;
        if (coupon.jenis_diskon === "persentase") {
          calculatedDiscount = subtotal * (coupon.nilai_diskon / 100);
        } else {
          calculatedDiscount = coupon.nilai_diskon;
        }
        setDiscount(calculatedDiscount);
        setAppliedCoupon(coupon);
        setCouponError("");
        toast.success(`Kupon ${coupon.code} berhasil diterapkan!`);
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponError("Kode kupon tidak valid atau sudah tidak aktif.");
      }
    } catch (error) {
      setCouponError("Gagal memvalidasi kupon.");
    }
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Anda harus login untuk melakukan checkout");
      navigate("/login");
      return;
    }

    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
    };

    try {
      await axiosInstance.post("/orders", payload);
      toast.success("Pesanan berhasil di buat!");
      clearCart(); // bertujuan ketika order berhasil di buat maka keranjangnya di hapus
      setCouponCode("");
      navigate("/orders-success");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Gagal membuat pesanan.";
      toast.error(errorMessage);
    }
  };

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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kode Kupon</label>
            <div className="flex">
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Masukkan kode"
                className="rounded-r-none"
              />
              <Button
                onClick={handleApplyCoupon}
                variant="secondary"
                className="rounded-l-none"
              >
                Terapkan
              </Button>
            </div>
            {couponError && (
              <p className="text-red-500 text-sm mt-1">{couponError}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Diskon ({appliedCoupon.code})</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-2">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-6"
            onClick={handleCheckout}
          >
            Lanjutkan ke Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
