import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import ProductForm from "../../components/features/ProductForm";
import { Toaster, toast } from "react-hot-toast";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Gagal mengambil data produk.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null); // Pastikan mode edit mati
    setIsModalOpen(true);
  };

  // Fungsi untuk menangani klik tombol edit
  const handleOpenEditModal = (product) => {
    setEditingProduct(product); // Atur produk yang akan diedit
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    const productData = { ...data, price: parseInt(data.price, 10) };
    if (editingProduct) {
      // Jika mode edit, panggil API update
      handleUpdateProduct(editingProduct.id, productData);
    } else {
      // Jika mode tambah, panggil API create
      handleAddProduct(productData);
    }
  };

  const handleAddProduct = async (data) => {
    try {
      // Konversi harga ke integer sebelum mengirim
      const productData = { ...data, price: parseInt(data.price, 10) };
      await axiosInstance.post("/products", productData);
      toast.success("Produk berhasil ditambahkan!");
      setIsModalOpen(false);
      fetchProducts(); // Muat ulang data
    } catch (error) {
      toast.error("Gagal menambahkan produk.");
    }
  };

  const handleUpdateProduct = async (productId, data) => {
    try {
      await axiosInstance.put(`/products/${productId}`, data);
      toast.success("Produk berhasil diperbarui!");
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Gagal memperbarui produk.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axiosInstance.delete(`/products/${productId}`);
        toast.success("Produk berhasil dihapus!");
        fetchProducts(); // Muat ulang data
      } catch (error) {
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  if (loading) {
    return <p>Memuat data produk...</p>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Tambah Produk
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Gambar</th>
                <th className="py-2 px-4 text-left">Nama Produk</th>
                <th className="py-2 px-4 text-left">Kategori</th>
                <th className="py-2 px-4 text-left">Harga</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <img
                      src={product.imageUrl || "https://placehold.co/64"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 font-medium">{product.name}</td>
                  <td className="py-2 px-4">
                    {product.category?.name || "N/A"}
                  </td>
                  <td className="py-2 px-4">{formatCurrency(product.price)}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
        >
          <ProductForm
            onFormSubmit={handleFormSubmit}
            closeForm={() => setIsModalOpen(false)}
            existingProduct={editingProduct}
          />
        </Modal>
      </div>
    </>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default AdminProductPage;
