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
  Check,
  X,
} from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemDecisions, setItemDecisions] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await api.get(`/requests/${id}`);
        setRequest(res.data);

        // Initialize decisions for each item
        const initial = {};
        res.data.items.forEach((item) => {
          initial[item.id] = {
            status: item.available_stock > 0 ? 'approved' : 'declined',
            quantity_approved: Math.min(
              item.quantity_requested,
              item.available_stock
            ),
          };
        });
        setItemDecisions(initial);
      } catch (err) {
        toast.error('Failed to load request');
        navigate('/dashboard/requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleToggle = (itemId, status, availableStock) => {
    setItemDecisions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status,
        quantity_approved:
          status === 'approved'
            ? prev[itemId]?.quantity_approved || 1
            : 0,
      },
    }));
  };

  const handleQtyChange = (itemId, qty, max) => {
    const parsed = parseInt(qty);
    if (isNaN(parsed) || parsed < 1) return;
    if (parsed > max) {
      toast.error(`Max available is ${max}`);
      return;
    }
    setItemDecisions((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity_approved: parsed },
    }));
  };

  const handleAccept = async () => {
    const items = request.items.map((item) => ({
      request_item_id: item.id,
      status: itemDecisions[item.id]?.status || 'declined',
      quantity_approved: itemDecisions[item.id]?.quantity_approved || 0,
    }));

    setSubmitting(true);
    try {
      await api.patch(`/requests/${id}/accept`, { items });
      toast.success('Request accepted successfully');
      navigate('/dashboard/requests');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!window.confirm(
      'Are you sure you want to decline this request?'
    )) return;

    setSubmitting(true);
    try {
      await api.patch(`/requests/${id}/decline`);
      toast.success('Request declined');
      navigate('/dashboard/requests');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to decline request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-400 text-sm">Loading request...</div>
      </div>
    );
  }

  if (!request) return null;

  const isPending = request.status === 'pending';

  return (
    <div>

      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/requests')}
        className="flex items-center gap-2 text-sm text-gray-500 
                   hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Requests
      </button>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Request Detail
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

        {/* Letter Proof */}
        {request.letter_proof && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-400 
                               uppercase tracking-wider">
                Letter Proof
              </span>
            </div>
            <a
              href={request.letter_proof}
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

      </div>

      {/* Components Table */}
      <div className="bg-white rounded-xl shadow-sm border 
                      border-gray-200 mb-6">

        <div className="px-6 pt-4 pb-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-700 uppercase 
                         tracking-wider">
            Requested Components
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  'Component Name',
                  'Requested Qty',
                  'Available Stock',
                  'Decision',
                  'Qty to Approve',
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
                const decision = itemDecisions[item.id];
                const isApproved = decision?.status === 'approved';
                const isOutOfStock = item.available_stock === 0;
                const maxQty = Math.min(
                  item.quantity_requested,
                  item.available_stock
                );

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

                    {/* Requested Qty */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.quantity_requested}
                    </td>

                    {/* Available Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          item.available_stock > 5
                            ? 'text-green-600'
                            : item.available_stock > 0
                            ? 'text-orange-500'
                            : 'text-red-500'
                        }`}
                      >
                        {isOutOfStock
                          ? 'Out of Stock'
                          : item.available_stock}
                      </span>
                    </td>

                    {/* Decision Toggle */}
                    <td className="px-6 py-4">
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              !isOutOfStock &&
                              handleToggle(
                                item.id,
                                'approved',
                                item.available_stock
                              )
                            }
                            disabled={isOutOfStock}
                            className={`flex items-center gap-1 px-3 py-1.5 
                                        rounded-lg text-xs font-semibold
                                        transition-all border
                                        disabled:opacity-40 
                                        disabled:cursor-not-allowed ${
                              isApproved && !isOutOfStock
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <Check size={12} />
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleToggle(item.id, 'declined', 0)
                            }
                            className={`flex items-center gap-1 px-3 py-1.5 
                                        rounded-lg text-xs font-semibold
                                        transition-all border ${
                              !isApproved || isOutOfStock
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-red-300'
                            }`}
                          >
                            <X size={12} />
                            Decline
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={item.status} />
                      )}
                    </td>

                    {/* Qty to Approve */}
                    <td className="px-6 py-4">
                      {isPending && isApproved && !isOutOfStock ? (
                        <input
                          type="number"
                          min={1}
                          max={maxQty}
                          value={decision?.quantity_approved || 1}
                          onChange={(e) =>
                            handleQtyChange(item.id, e.target.value, maxQty)
                          }
                          className="w-20 border border-gray-200 rounded-lg 
                                     px-3 py-1.5 text-sm text-center
                                     focus:outline-none focus:ring-2
                                     bg-gray-50"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">
                          {isPending ? '—' : item.quantity_approved}
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Action Buttons — only show if pending */}
      {isPending && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleDecline}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold
                       border-2 transition-all hover:bg-red-50
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderColor: '#DC2626', color: '#DC2626' }}
          >
            Decline Request
          </button>
          <button
            onClick={handleAccept}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold
                       text-white transition-all hover:opacity-90
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#9B1B4B' }}
          >
            {submitting ? 'Processing...' : 'Accept Request'}
          </button>
        </div>
      )}

    </div>
  );
};
export default RequestDetail;