import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CategoryForm from "../../components/features/CategoryForm";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    const promise = editingCategory
      ? axiosInstance.put(`/categories/${editingCategory.id}`, data)
      : axiosInstance.post("/categories", data);

    try {
      await toast.promise(promise, {
        loading: "Menyimpan...",
        success: `Kategori berhasil ${
          editingCategory ? "diperbarui" : "ditambahkan"
        }!`,
        error: `Gagal ${
          editingCategory ? "memperbarui" : "menambahkan"
        } kategori.`,
      });
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan kategori.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      try {
        await axiosInstance.delete(`/categories/${id}`);
        toast.success("Kategori berhasil dihapus!");
        fetchCategories();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Gagal menghapus kategori."
        );
      }
    }
  };

  if (loading) return <p>Memuat...</p>;

  return (
    <>
      <Toaster />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
          <Button onClick={handleOpenAddModal}>Tambah Kategori</Button>
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-left">Deskripsi</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b">
                <td className="py-2 px-4 font-medium">{cat.name}</td>
                <td className="py-2 px-4">{cat.description}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="text-blue-500"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500"
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
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori"}
      >
        <CategoryForm
          onFormSubmit={handleFormSubmit}
          closeForm={() => setIsModalOpen(false)}
          existingCategory={editingCategory}
        />
      </Modal>
    </>
  );
};

export default AdminCategoryPage;
