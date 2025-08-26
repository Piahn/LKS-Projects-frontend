import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white bg-opacity-50 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
