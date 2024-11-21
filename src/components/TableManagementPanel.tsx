import { useState } from 'react';
import { Plus, QrCode, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import AddTableModal from './AddTableModal';

export default function TableManagementPanel() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const tables = useStore(state => state.getTables());
  const addTable = useStore(state => state.addTable);
  const deleteTable = useStore(state => state.deleteTable);

  const handleAddTable = (tableData: { number: string; seats: number; location?: string }) => {
    addTable(tableData);
    setShowAddModal(false);
  };

  const handleDeleteTable = (tableId: string) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      deleteTable(tableId);
    }
  };

  const handleGenerateQR = async (table: { id: string; number: string }) => {
    // Create QR code value
    const qrValue = `${window.location.origin}/scan?tableId=${table.id}`;
    
    // Create canvas and render QR code
    const canvas = document.createElement('canvas');
    const qrSize = 256;
    canvas.width = qrSize;
    canvas.height = qrSize;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Create temporary QR code element
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Render QR code
    const qrCode = <QRCodeSVG value={qrValue} size={qrSize} level="H" includeMargin={true} />;
    const ReactDOM = await import('react-dom/client');
    const root = ReactDOM.createRoot(tempDiv);
    root.render(qrCode);

    // Wait for QR code to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get SVG element
    const svg = tempDiv.querySelector('svg');
    if (!svg) {
      document.body.removeChild(tempDiv);
      return;
    }

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create image from SVG
    const img = new Image();
    img.onload = () => {
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, qrSize, qrSize);
      
      // Draw QR code
      ctx.drawImage(img, 0, 0);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add content to PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const qrWidth = 100; // mm
      const qrHeight = 100; // mm
      const xPos = (pageWidth - qrWidth) / 2;
      const yPos = 50; // mm from top

      // Add title
      pdf.setFontSize(20);
      pdf.text(`Table ${table.number} QR Code`, pageWidth / 2, 20, { align: 'center' });

      // Add QR code
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', xPos, yPos, qrWidth, qrHeight);

      // Add table information
      pdf.setFontSize(12);
      pdf.text(`Table ID: ${table.id}`, pageWidth / 2, yPos + qrHeight + 10, { align: 'center' });
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos + qrHeight + 20, { align: 'center' });

      // Add instructions
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text('Scan this QR code with your mobile device to access the table menu', pageWidth / 2, yPos + qrHeight + 30, { align: 'center' });

      // Save PDF
      pdf.save(`table-${table.number}-qr.pdf`);

      // Clean up
      URL.revokeObjectURL(svgUrl);
      document.body.removeChild(tempDiv);
    };

    img.src = svgUrl;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Table Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Table {table.number}</h3>
                <p className="text-sm text-gray-500">{table.seats} seats</p>
                {table.location && (
                  <p className="text-sm text-gray-500">{table.location}</p>
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                table.status === 'available' ? 'bg-green-100 text-green-800' :
                table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                table.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {table.status}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                ID: {table.id}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerateQR(table)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg flex items-center gap-1"
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-sm">Download QR</span>
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddTableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTable}
      />
    </div>
  );
}