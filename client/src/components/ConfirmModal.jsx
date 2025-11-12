export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
        <p className="text-sm text-gray-500">This task will be moved to Trash.</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
