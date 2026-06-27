export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F0F0F] border border-white/[0.07] rounded-2xl shadow-2xl p-8 min-w-[350px] w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
