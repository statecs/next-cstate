'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, url, title = 'Scan QR Code' }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 dark:bg-black/80 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white dark:bg-custom-dark-gray rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full pointer-events-auto animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 pr-8 font-serif">
            {title}
          </h2>

          {/* QR Code Container */}
          <div className="flex justify-center items-center bg-white p-4 rounded-xl">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              includeMargin={true}
              className="w-full h-auto max-w-[256px]"
            />
          </div>

          {/* URL Display */}
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center break-all">
            {url}
          </p>

          {/* Info Text */}
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
            Scan this code to open the link on your mobile device
          </p>
        </div>
      </div>
    </>
  );
};

export default QRCodeModal;
