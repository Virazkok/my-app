import { useState } from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import axios from 'axios';

interface Props {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QrScannerComponent: React.FC<Props> = ({ onScan, onClose }) => {
  const [message, setMessage] = useState('');

  const handleScan = async (codes: IDetectedBarcode[]) => {
    if (codes.length > 0) {
      const token = codes[0].rawValue;
      setMessage('QR Terdeteksi, memproses...');
      onScan(token);
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
    setMessage('Scanner error');
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Scan QR Code</h2>
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{ facingMode: 'environment' }}
        styles={{
          container: { width: '100%', maxWidth: '500px', margin: 'auto' },
          video: { width: '100%' },
        }}
      />
      <p className="mt-4 text-green-600">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
      >
        Kembali
      </button>
    </div>
  );
};

export default QrScannerComponent;
