import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  iconClass?: string;
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  title,
  message,
  iconClass = 'fa-circle-check',
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 text-center transform transition-all border border-indigo-500/20">
        <div className="w-16 h-16 rounded-full bg-indigo-900/60 text-indigo-300 flex items-center justify-center text-3xl mx-auto mb-4 border border-indigo-700">
          <i className={`fa-solid ${iconClass}`}></i>
        </div>
        <h3 className="kids-font text-2xl text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: message }}></p>
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-2xl transition kids-font text-lg cursor-pointer shadow-md"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
