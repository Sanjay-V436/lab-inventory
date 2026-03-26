import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { formatDate } from '../../utils/formatDate';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/history', {
        params: { search, status, sort, page, limit: 10 }
      });
      setHistory(res.data.history);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, sort, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">History</h1>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Tab Header */}
        <div className="px-6 pt-4 border-b border-gray-200">
          <button
            className="text-sm font-semibold pb-3 border-b-2"
            style={{ color: '#9B1B4B', borderColor: '#9B1B4B' }}
          >
            History List
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-6 py-4 flex flex-wrap items-center
                        justify-between gap-3 border-b border-gray-100">

          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2
                         text-gray-400"
            />
            <input
              type="text"
              placeholder="Search name, roll no, ref id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200
                         rounded-lg bg-gray-50 focus:outline-none
                         focus:ring-2 w-64"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg
                           px-3 py-2 bg-gray-50 focus:outline-none
                           text-gray-700"
              >
                <option value="all">All</option>
                <option value="returned">Returned</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg
                         px-3 py-2 bg-gray-50 focus:outline-none
                         text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="return_date">Return Date</option>
            </select>
          </div>

        </div>

        {/* Results count */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {history.length} of {total} records
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  'Ref ID',
                  'Student Name',
                  'Roll No',
                  'Department',
                  'Status',
                  'Return Date',
                  'Completed On',
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
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded
                                        animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No history records found
                  </td>
                </tr>
              ) : (
                history.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-50 hover:bg-gray-50
                               transition-colors"
                  >
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/history/${req.id}`)
                        }
                        className="text-sm font-semibold hover:underline"
                        style={{ color: '#9B1B4B' }}
                      >
                        {req.ref_id}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {req.student_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {req.roll_no}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {req.department}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(req.return_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {req.completed_on
                        ? formatDate(req.completed_on)
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex
                          items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200
                           hover:bg-gray-50 disabled:opacity-40
                           disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium
                              transition-colors ${
                    page === i + 1
                      ? 'text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  style={page === i + 1
                    ? { backgroundColor: '#9B1B4B' }
                    : {}
                  }
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200
                           hover:bg-gray-50 disabled:opacity-40
                           disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;