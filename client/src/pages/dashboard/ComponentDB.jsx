import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
} from 'lucide-react';

// Modal Component
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div
      className="absolute inset-0 bg-black bg-opacity-30"
      onClick={onClose}
    />
    <div className="relative bg-white rounded-2xl shadow-xl
                    w-full max-w-md mx-4 p-6 z-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ComponentDB = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('name_asc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Form states
  const [addForm, setAddForm] = useState({
    parent_id: '',
    name: '',
    stock: 0,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    stock: 0,
  });

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/components');
      setComponents(res.data);
    } catch (err) {
      toast.error('Failed to load components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  // Get parent name for a component
  const getParentName = (parentId) => {
    if (!parentId) return 'Root Category';
    const parent = components.find((c) => c.id === parentId);
    return parent?.name || '—';
  };

  // Get only root/parent components for dropdown
  const rootComponents = components.filter((c) => c.parent_id === null);

  // Filter and sort components
  const filtered = components
    .filter((c) => {
      const matchesSearch = c.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all'
          ? true
          : filter === 'root'
          ? c.parent_id === null
          : c.parent_id !== null;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      if (sort === 'name_desc') return b.name.localeCompare(a.name);
      if (sort === 'stock_low') return a.stock - b.stock;
      if (sort === 'stock_high') return b.stock - a.stock;
      return 0;
    });

  // Add component
  const handleAdd = async () => {
    if (!addForm.name.trim()) {
      toast.error('Component name is required');
      return;
    }
    try {
      await api.post('/components', {
        parent_id: addForm.parent_id || null,
        name: addForm.name,
        stock: Number(addForm.stock),
      });
      toast.success('Component added successfully');
      setShowAddModal(false);
      setAddForm({ parent_id: '', name: '', stock: 0 });
      fetchComponents();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add component');
    }
  };

  // Edit component
  const handleEditOpen = (component) => {
    setSelectedComponent(component);
    setEditForm({ name: component.name, stock: component.stock });
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!editForm.name.trim()) {
      toast.error('Component name is required');
      return;
    }
    try {
      await api.put(`/components/${selectedComponent.id}`, {
        name: editForm.name,
        stock: Number(editForm.stock),
      });
      toast.success('Component updated successfully');
      setShowEditModal(false);
      fetchComponents();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update component');
    }
  };

  // Delete component
  const handleDeleteOpen = (component) => {
    setSelectedComponent(component);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/components/${selectedComponent.id}`);
      toast.success('Component deleted successfully');
      setShowDeleteModal(false);
      fetchComponents();
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to delete component'
      );
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Component DB</h1>
      
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Tab Header */}
        <div className="px-6 pt-4 border-b border-gray-200 flex
                        items-center justify-between">
          <button
            className="text-sm font-semibold pb-3 border-b-2"
            style={{ color: '#9B1B4B', borderColor: '#9B1B4B' }}
          >
            Component List
          </button>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-white text-sm
                       font-semibold px-4 py-2 rounded-lg mb-3
                       hover:opacity-90 transition-all"
            style={{ backgroundColor: '#6B21A8' }}
          >
            <Plus size={15} />
            Add Component
          </button>
        </div>

        {/* Search Filter Sort Bar */}
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
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200
                         rounded-lg bg-gray-50 focus:outline-none
                         focus:ring-2 w-56"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg
                         px-3 py-2 bg-gray-50 focus:outline-none
                         text-gray-700"
            >
              <option value="all">All Components</option>
              <option value="root">Root Categories</option>
              <option value="leaf">Leaf Components</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg
                         px-3 py-2 bg-gray-50 focus:outline-none
                         text-gray-700"
            >
              <option value="name_asc">Name A–Z</option>
              <option value="name_desc">Name Z–A</option>
              <option value="stock_low">Stock Low–High</option>
              <option value="stock_high">Stock High–Low</option>
            </select>
          </div>

        </div>

        {/* Results count */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of {components.length} components
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  'ID',
                  'Component Name',
                  'Parent Category',
                  'Stock',
                  'Actions',
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
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded
                                        animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No components found
                  </td>
                </tr>
              ) : (
                filtered.map((component) => (
                  <tr
                    key={component.id}
                    className="border-b border-gray-50
                               hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {component.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {component.parent_id === null && (
                          <span
                            className="text-xs font-semibold px-2
                                       py-0.5 rounded-full text-white"
                            style={{ backgroundColor: '#9B1B4B' }}
                          >
                            Category
                          </span>
                        )}
                        <span className="text-sm font-medium
                                         text-gray-800">
                          {component.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getParentName(component.parent_id)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          component.stock > 5
                            ? 'text-green-600'
                            : component.stock > 0
                            ? 'text-orange-500'
                            : 'text-red-500'
                        }`}
                      >
                        {component.parent_id === null
                          ? '—'
                          : component.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOpen(component)}
                          className="flex items-center gap-1.5 px-3
                                     py-1.5 rounded-lg text-xs
                                     font-semibold border border-gray-200
                                     text-gray-600 hover:bg-gray-50
                                     transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOpen(component)}
                          className="flex items-center gap-1.5 px-3
                                     py-1.5 rounded-lg text-xs
                                     font-semibold border border-red-100
                                     text-red-500 hover:bg-red-50
                                     transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          title="Add New Component"
          onClose={() => setShowAddModal(false)}
        >
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium
                                text-gray-600 mb-1">
                Parent Category
              </label>
              <select
                value={addForm.parent_id}
                onChange={(e) =>
                  setAddForm({ ...addForm, parent_id: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg
                           px-4 py-2.5 text-sm bg-gray-50
                           focus:outline-none focus:ring-2"
              >
                <option value="">Root Category (no parent)</option>
                {rootComponents.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium
                                text-gray-600 mb-1">
                Component Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="Enter component name"
                className="w-full border border-gray-200 rounded-lg
                           px-4 py-2.5 text-sm bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium
                                text-gray-600 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                min={0}
                value={addForm.stock}
                onChange={(e) =>
                  setAddForm({ ...addForm, stock: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg
                           px-4 py-2.5 text-sm bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-gray-200 text-gray-600
                           font-semibold py-2.5 rounded-lg text-sm
                           hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 text-white font-semibold py-2.5
                           rounded-lg text-sm hover:opacity-90
                           transition-all"
                style={{ backgroundColor: '#9B1B4B' }}
              >
                Add Component
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          title="Edit Component"
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium
                                text-gray-600 mb-1">
                Component Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg
                           px-4 py-2.5 text-sm bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium
                                text-gray-600 mb-1">
                Stock
              </label>
              <input
                type="number"
                min={0}
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg
                           px-4 py-2.5 text-sm bg-gray-50
                           focus:outline-none focus:ring-2"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 border border-gray-200 text-gray-600
                           font-semibold py-2.5 rounded-lg text-sm
                           hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 text-white font-semibold py-2.5
                           rounded-lg text-sm hover:opacity-90
                           transition-all"
                style={{ backgroundColor: '#9B1B4B' }}
              >
                Save Changes
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <Modal
          title="Delete Component"
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-800">
                {selectedComponent?.name}
              </span>
              ? This action cannot be undone.
            </p>

            {selectedComponent?.parent_id === null && (
              <div className="bg-yellow-50 border border-yellow-200
                              rounded-lg px-4 py-3">
                <p className="text-xs text-yellow-700 font-medium">
                  ⚠️ This is a root category. Deleting it will also
                  delete all child components.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-200 text-gray-600
                           font-semibold py-2.5 rounded-lg text-sm
                           hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 text-white font-semibold py-2.5
                           rounded-lg text-sm hover:opacity-90
                           transition-all bg-red-500"
              >
                Delete
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default ComponentDB;
