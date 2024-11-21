import { useState } from 'react';
import { Plus, Download, UserX, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Staff } from '../types';
import { jsPDF } from 'jspdf';
import AddStaffModal from './AddStaffModal';

export default function StaffManagementPanel() {
  const [showAddModal, setShowAddModal] = useState(false);
  const staff = useStore(state => state.getStaff());
  const updateStaffStatus = useStore(state => state.updateStaffStatus);
  const deleteStaff = useStore(state => state.deleteStaff);

  const handleDownloadCredentials = (staffMember: Staff) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add restaurant logo/name
    pdf.setFontSize(20);
    pdf.text('Quisin Restaurant', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Add staff credentials section
    pdf.setFontSize(16);
    pdf.text('Staff Login Credentials', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    // Add staff information
    pdf.setFontSize(12);
    const startY = 60;
    const lineHeight = 10;

    pdf.text(`Staff ID: ${staffMember.id}`, 20, startY);
    pdf.text(`Name: ${staffMember.name}`, 20, startY + lineHeight);
    pdf.text(`Email: ${staffMember.email}`, 20, startY + lineHeight * 2);
    pdf.text(`Phone: ${staffMember.phone}`, 20, startY + lineHeight * 3);
    
    // Add shift information
    pdf.text('Work Shift:', 20, startY + lineHeight * 4);
    pdf.text(`Days: ${staffMember.shift.days.join(', ')}`, 30, startY + lineHeight * 5);
    pdf.text(`Hours: ${staffMember.shift.start} - ${staffMember.shift.end}`, 30, startY + lineHeight * 6);

    // Add credentials section with a border
    pdf.setDrawColor(200);
    pdf.rect(20, startY + lineHeight * 7, pdf.internal.pageSize.getWidth() - 40, lineHeight * 4);
    
    pdf.setFontSize(14);
    pdf.text('Login Credentials', pdf.internal.pageSize.getWidth() / 2, startY + lineHeight * 8, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Username: ${staffMember.username}`, 30, startY + lineHeight * 9);
    pdf.text(`Password: ${staffMember.password}`, 30, startY + lineHeight * 10);

    // Add footer with instructions
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    const footerText = 'Please keep these credentials secure and change your password upon first login.';
    pdf.text(footerText, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 20, { align: 'center' });

    // Save the PDF
    pdf.save(`${staffMember.name.replace(/\s+/g, '-').toLowerCase()}-credentials.pdf`);
  };

  const handleToggleStatus = (staffId: string, currentStatus: Staff['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateStaffStatus(staffId, newStatus);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(staffId);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Staff Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((staffMember) => (
          <div key={staffMember.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{staffMember.name}</h3>
                <p className="text-sm text-gray-500">{staffMember.email}</p>
                <p className="text-sm text-gray-500">{staffMember.phone}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                staffMember.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {staffMember.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Shift: {staffMember.shift.start} - {staffMember.shift.end}
              </p>
              <p className="text-sm text-gray-600">
                Days: {staffMember.shift.days.join(', ')}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => handleDownloadCredentials(staffMember)}
                className="flex items-center gap-1 px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-lg"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download Credentials</span>
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(staffMember.id, staffMember.status)}
                  className={`p-2 rounded-lg ${
                    staffMember.status === 'active'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {staffMember.status === 'active' ? (
                    <UserX className="w-5 h-5" />
                  ) : (
                    <UserCheck className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}