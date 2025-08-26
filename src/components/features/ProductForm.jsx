import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

const schema = yup.object().shape({
  name: yup.string().required("Nama produk wajib diisi"),
  price: yup
    .number()
    .typeError("Harga harus angka")
    .positive("Harga harus positif")
    .required("Harga wajib diisi"),
  categoryId: yup.string().required("Kategori wajib dipilih"),
  imageUrl: yup.string().url("URL gambar tidak valid").nullable(),
});

const ProductForm = ({ onFormSubmit, closeForm, existingProduct }) => {
  const [categories, setCategories] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: existingProduct || {},
  });

  useEffect(() => {
    if (existingProduct) {
      reset(existingProduct);
    }
  }, [existingProduct, reset]);

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => setCategories(res.data.data));
  }, []);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label>Nama Produk</label>
        <Input {...register("name")} placeholder="Cth: Baju Kemeja" />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label>Harga</label>
        <Input type="number" {...register("price")} placeholder="Cth: 150000" />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>
      <div>
        <label>Kategori</label>
        <select
          {...register("categoryId")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>
      <div>
        <label>URL Gambar (Opsional)</label>
        <Input {...register("imageUrl")} placeholder="https://..." />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={closeForm}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {existingProduct ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
