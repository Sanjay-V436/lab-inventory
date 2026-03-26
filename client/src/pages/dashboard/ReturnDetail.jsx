import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
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
  Check,
  X,
} from 'lucide-react';

const ReturnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemConditions, setItemConditions] = useState({});
  const [overallRemarks, setOverallRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReturn = async () => {
      try {
        const res = await api.get(`/returns/${id}`);
        setRequest(res.data);

        // Initialize all items as returned
        const initial = {};
        res.data.items.forEach((item) => {
          initial[item.id] = {
            condition: 'returned',
            remarks: '',
          };
        });
        setItemConditions(initial);
      } catch (err) {
        toast.error('Failed to load return details');
        navigate('/dashboard/returns');
      } finally {
        setLoading(false);
      }
    };
    fetchReturn();
  }, [id]);

  const handleConditionChange = (itemId, condition) => {
    setItemConditions((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], condition },
    }));
  };

  const handleRemarksChange = (itemId, remarks) => {
    setItemConditions((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], remarks },
    }));
  };

  const handleSubmit = async () => {
    // Validate remarks for damaged items
    for (const item of request.items) {
      const condition = itemConditions[item.id];
      if (condition?.condition === 'damaged' && !condition?.remarks?.trim()) {
        toast.error(`Please add remarks for damaged item: ${item.component_name}`);
        return;
      }
    }

    const items = request.items.map((item) => ({
      request_item_id: item.id,
      condition: itemConditions[item.id]?.condition || 'returned',
      remarks: itemConditions[item.id]?.remarks || '',
    }));

    setSubmitting(true);
    try {
      await api.post(`/returns/${id}`, {
        remarks: overallRemarks,
        items,
      });
      toast.success('Return submitted successfully');
      navigate('/dashboard/history');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit return');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-400 text-sm">Loading return details...</div>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/returns')}
        className="flex items-center gap-2 text-sm text-gray-500
                   hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Returns
      </button>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          Process Return
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ref: {request.ref_id}
        </p>
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
      </div>

      {/* Components Return Table */}
      <div className="bg-white rounded-xl shadow-sm border
                      border-gray-200 mb-6">
        <div className="px-6 pt-4 pb-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 uppercase
                         tracking-wider">
            Component Conditions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  'Component Name',
                  'Qty Approved',
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
              {request.items.map((item) => {
                const condition = itemConditions[item.id];
                const isReturned = condition?.condition === 'returned';

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50
                               hover:bg-gray-50 transition-colors"
                  >
                    {/* Component Name */}
                    <td className="px-6 py-4 text-sm font-medium
                                   text-gray-800">
                      {item.component_name}
                    </td>

                    {/* Qty Approved */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.quantity_approved}
                    </td>

                    {/* Condition Toggle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleConditionChange(item.id, 'returned')
                          }
                          className={`flex items-center gap-1.5 px-3 
                                      py-1.5 rounded-lg text-xs 
                                      font-semibold transition-all border ${
                            isReturned
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <Check size={12} />
                          Returned
                        </button>
                        <button
                          onClick={() =>
                            handleConditionChange(item.id, 'damaged')
                          }
                          className={`flex items-center gap-1.5 px-3 
                                      py-1.5 rounded-lg text-xs 
                                      font-semibold transition-all border ${
                            !isReturned
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
                          }`}
                        >
                          <X size={12} />
                          Damaged
                        </button>
                      </div>
                    </td>

                    {/* Remarks */}
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder={
                          !isReturned
                            ? 'Required for damaged items...'
                            : 'Optional remarks...'
                        }
                        value={condition?.remarks || ''}
                        onChange={(e) =>
                          handleRemarksChange(item.id, e.target.value)
                        }
                        className={`w-full border rounded-lg px-3 py-1.5 
                                    text-sm focus:outline-none focus:ring-2
                                    bg-gray-50 ${
                          !isReturned
                            ? 'border-red-200 focus:ring-red-100'
                            : 'border-gray-200'
                        }`}
                      />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overall Remarks */}
        <div className="px-6 py-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Overall Remarks (Optional)
          </label>
          <textarea
            value={overallRemarks}
            onChange={(e) => setOverallRemarks(e.target.value)}
            placeholder="Any general remarks about this return..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4
                       py-2.5 text-sm text-gray-800 bg-gray-50
                       focus:outline-none focus:ring-2 resize-none"
          />
        </div>

      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-2.5 rounded-xl text-sm font-semibold
                     text-white transition-all hover:opacity-90
                     disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#9B1B4B' }}
        >
          {submitting ? 'Submitting...' : 'Submit Return'}
        </button>
      </div>

    </div>
  );
};

export default ReturnDetail;
