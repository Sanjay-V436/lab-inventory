import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useComponents from '../hooks/useComponents';
import ComponentTree from '../components/ComponentTree';
import Cart from '../components/Cart';
import AmritaLogo from '../components/AmritaLogo';
import { Upload, X } from 'lucide-react';

const StudentForm = () => {
  const navigate = useNavigate();
  const { tree, flatList, loading } = useComponents();

  const [form, setForm] = useState({
    student_name: '',
    roll_no: '',
    mentor_name: '',
    email: '',
    department: '',
    return_date: '',
  });

  const [letterProof, setLetterProof] = useState(null);
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setLetterProof(file);
    }
  };

  // Cart handlers
  const handleAddToCart = (component) => {
    const existing = cart.find((c) => c.component_id === component.id);
    if (existing) return;
    setCart([...cart, { component_id: component.id, quantity: 1 }]);
    toast.success(`${component.name} added to cart`);
  };

  const handleRemoveFromCart = (componentId) => {
    setCart(cart.filter((c) => c.component_id !== componentId));
  };

  const handleQuantityChange = (componentId, newQty) => {
    const component = flatList.find((c) => c.id === componentId);
    if (newQty < 1) {
      handleRemoveFromCart(componentId);
      return;
    }
    if (newQty > component?.stock) {
      toast.error(`Only ${component.stock} available`);
      return;
    }
    setCart(
      cart.map((c) =>
        c.component_id === componentId ? { ...c, quantity: newQty } : c
      )
    );
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.student_name.trim())
      newErrors.student_name = 'Name is required';
    if (!form.roll_no.trim())
      newErrors.roll_no = 'Roll number is required';
    if (!form.mentor_name.trim())
      newErrors.mentor_name = 'Mentor name is required';
    if (!form.email.trim())
      newErrors.email = 'Email is required';
    else if (!form.email.endsWith('@ch.students.amrita.edu'))
      newErrors.email = 'Must be a valid Amrita email (@ch.students.amrita.edu)';
    if (!form.department)
      newErrors.department = 'Department is required';
    if (!form.return_date)
      newErrors.return_date = 'Return date is required';
    else if (new Date(form.return_date) <= new Date())
      newErrors.return_date = 'Return date must be in the future';
    if (!letterProof)
      newErrors.letterProof = 'Letter proof is required';
    if (cart.length === 0)
      newErrors.cart = 'Please add at least one component';
    return newErrors;
  };

  // Submit handler
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('student_name', form.student_name);
      formData.append('roll_no', form.roll_no);
      formData.append('mentor_name', form.mentor_name);
      formData.append('email', form.email);
      formData.append('department', form.department);
      formData.append('return_date', form.return_date);
      formData.append('items', JSON.stringify(cart));
      formData.append('letter_proof', letterProof);

      const res = await api.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/success', { state: { ref_id: res.data.ref_id } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>

      {/* Header */}
      <div
        className="text-white px-6 py-4 flex items-center gap-4 shadow-md"
        style={{ backgroundColor: '#9B1B4B' }}
      >
        <AmritaLogo size="sm" light={true} />
        <div className="w-px h-8 bg-white opacity-30" />
        <div>
          <p className="text-sm font-bold">RHISC Lab</p>
          <p className="text-xs opacity-70">Component Request Form</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Lab Component Request
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in your details and select the components you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT — Student Details */}
          <div className="bg-white rounded-xl shadow-sm border
                          border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5
                           pb-3 border-b border-gray-100">
              Student Details
            </h2>

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={form.student_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                />
                {errors.student_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.student_name}
                  </p>
                )}
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roll_no"
                  value={form.roll_no}
                  onChange={handleChange}
                  placeholder="e.g. CH.EN.U4CSE22001"
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                />
                {errors.roll_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.roll_no}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="CYS">CYS</option>
                  <option value="AI">AI</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ECE">ECE</option>
                  <option value="CCE">CCE</option>
                  <option value="MECH">MECH</option>
                  <option value="ARE">ARE</option>
                  <option value="RAI">RAI</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Mentor Name */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Mentor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mentor_name"
                  value={form.mentor_name}
                  onChange={handleChange}
                  placeholder="Enter mentor's name"
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                />
                {errors.mentor_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mentor_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  College Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="yourname@cb.amrita.edu"
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Expected Return Date{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="return_date"
                  value={form.return_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-200 rounded-lg
                             px-4 py-2.5 text-sm text-gray-800 bg-gray-50
                             focus:outline-none focus:ring-2"
                />
                {errors.return_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.return_date}
                  </p>
                )}
              </div>

              {/* Letter Proof */}
              <div>
                <label className="block text-sm font-medium
                                  text-gray-600 mb-1">
                  Letter Proof <span className="text-red-500">*</span>
                </label>
                <label
                  className="w-full border-2 border-dashed border-gray-200
                             rounded-lg px-4 py-4 flex flex-col items-center
                             justify-center cursor-pointer hover:border-gray-300
                             transition-colors bg-gray-50"
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {letterProof ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium">
                        {letterProof.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setLetterProof(null);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload
                        size={20}
                        className="text-gray-400 mb-1"
                      />
                      <span className="text-sm text-gray-400">
                        Click to upload PDF or Image
                      </span>
                      <span className="text-xs text-gray-300 mt-0.5">
                        Max 5MB
                      </span>
                    </>
                  )}
                </label>
                {errors.letterProof && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.letterProof}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT — Component Selection */}
          <div className="flex flex-col gap-6">

            {/* Component Tree */}
            <div className="bg-white rounded-xl shadow-sm border
                            border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-5
                             pb-3 border-b border-gray-100">
                Select Components
              </h2>

              {loading ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Loading components...
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto pr-1">
                  <ComponentTree
                    tree={tree}
                    cart={cart}
                    onAdd={handleAddToCart}
                    onRemove={handleRemoveFromCart}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="bg-white rounded-xl shadow-sm border
                            border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-800 mb-5
                             pb-3 border-b border-gray-100 flex
                             items-center justify-between">
                <span>Selected Components</span>
                <span
                  className="text-sm font-semibold px-2.5 py-0.5
                             rounded-full text-white"
                  style={{ backgroundColor: '#9B1B4B' }}
                >
                  {cart.length}
                </span>
              </h2>

              <Cart
                cart={cart}
                flatList={flatList}
                onRemove={handleRemoveFromCart}
                onQuantityChange={handleQuantityChange}
              />

              {errors.cart && (
                <p className="text-red-500 text-xs mt-2">{errors.cart}</p>
              )}
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-white font-semibold px-12 py-3 rounded-xl
                       text-sm transition-all hover:opacity-90
                       disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-md"
            style={{ backgroundColor: '#9B1B4B' }}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StudentForm;