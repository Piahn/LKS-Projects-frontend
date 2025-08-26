import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../ui/Input";
import Button from "../ui/Button";

const schema = yup.object().shape({
  name: yup.string().required("Nama kategori wajib diisi"),
  description: yup.string().required("Deskripsi wajib diisi"),
});

const CategoryForm = ({ onFormSubmit, closeForm, existingCategory }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: existingCategory || {},
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label>Nama Kategori</label>
        <Input {...register("name")} placeholder="Cth: Pakaian Pria" />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label>Deskripsi</label>
        <textarea
          {...register("description")}
          placeholder="Deskripsi singkat mengenai kategori ini"
          className="w-full mt-1 p-2 border rounded-md"
          rows="3"
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={closeForm}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {existingCategory ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
