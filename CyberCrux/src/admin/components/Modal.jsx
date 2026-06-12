export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 min-w-[350px] relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
} 