import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useStore } from '../store/useStore';

export default function QRScanner() {
  const navigate = useNavigate();
  const setTableId = useStore(state => state.setTableId);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Extract table ID from QR code
          let tableId;
          try {
            if (decodedText.includes('tableId=')) {
              const url = new URL(decodedText);
              tableId = url.searchParams.get('tableId');
            } else {
              tableId = decodedText.split(':')[1];
            }

            if (tableId) {
              setTableId(tableId);
              navigate('/');
            }
          } catch (error) {
            console.error('Error processing QR code:', error);
          }
        },
        (error) => {
          console.error('QR Scan error:', error);
        }
      );
    }

    // For development, automatically set a table ID after 2 seconds
    const timer = setTimeout(() => {
      setTableId('T123');
      navigate('/');
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (error) {
          console.error('Error clearing scanner:', error);
        }
      }
    };
  }, [navigate, setTableId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-orange-50">
      <div className="w-full max-w-lg text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan Table QR Code</h2>
        <p className="text-gray-600">Please scan the QR code on your table to continue</p>
      </div>
      
      <div id="qr-reader" className="w-full max-w-lg"></div>
    </div>
  );
}