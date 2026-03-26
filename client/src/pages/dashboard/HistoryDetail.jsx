import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  User,
  Hash,
  Building,
  GraduationCap,
  Mail,
  Calendar,
  FileText,
} from 'lucide-react';

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/history/${id}`);
        setRequest(res.data);
      } catch (err) {
        toast.error('Failed to load history record');
        navigate('/dashboard/history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/history')}
        className="flex items-center gap-2 text-sm text-gray-500
                   hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to History
      </button>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            History Detail
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ref: {request.ref_id}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-sm border
                      border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4
                       uppercase tracking-wider">
          Student Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: <User size={15} />,
              label: 'Student Name',
              value: request.student_name,
            },
            {
              icon: <Hash size={15} />,
              label: 'Roll Number',
              value: request.roll_no,
            },
            {
              icon: <Building size={15} />,
              label: 'Department',
              value: request.department,
            },
            {
              icon: <GraduationCap size={15} />,
              label: 'Mentor',
              value: request.mentor_name,
            },
            {
              icon: <Mail size={15} />,
              label: 'Email',
              value: request.email,
            },
            {
              icon: <Calendar size={15} />,
              label: 'Return Date',
              value: formatDate(request.return_date),
            },
          ].map((info) => (
            <div key={info.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-400">
                {info.icon}
                <span className="text-xs font-medium uppercase
                                 tracking-wider">
                  {info.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 pl-5">
                {info.value}
              </p>
            </div>
          ))}
        </div>

        {/* Letter proof */}
        {request.letter_proof && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400
                               uppercase tracking-wider">
                Letter Proof
              </span>
            </div>
            
            <a href={`http://localhost:5000/uploads/${request.letter_proof}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:underline mt-1
                         pl-5 block"
              style={{ color: '#9B1B4B' }}
            >
              View Letter Proof →
            </a>
          </div>
        )}

        {/* Overall return remarks */}
        {request.return_remarks && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400
                          uppercase tracking-wider mb-1">
              Overall Remarks
            </p>
            <p className="text-sm text-gray-700 pl-0">
              {request.return_remarks}
            </p>
          </div>
        )}

      </div>

      {/* Components Table */}
      <div className="bg-white rounded-xl shadow-sm border
                      border-gray-200">
        <div className="px-6 pt-4 pb-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 uppercase
                         tracking-wider">
            Components
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  'Component Name',
                  'Requested',
                  'Approved',
                  'Decision',
                  'Condition',
                  'Remarks',
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold
                               text-gray-500 px-6 py-3 uppercase
                               tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {request.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50
                             hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium
                                 text-gray-800">
                    {item.component_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.quantity_requested}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.quantity_approved}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    {item.condition ? (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1
                                    rounded-full capitalize ${
                          item.condition === 'returned'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {item.condition}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.item_remarks || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default HistoryDetail;