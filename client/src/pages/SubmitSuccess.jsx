import { useLocation, useNavigate } from 'react-router-dom';
import AmritaLogo from '../components/AmritaLogo';
import { CheckCircle } from 'lucide-react';

const SubmitSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ref_id = location.state?.ref_id || 'N/A';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>

      {/* Header */}
      <div
        className="text-white px-6 py-4 flex items-center gap-4"
        style={{ backgroundColor: '#9B1B4B' }}
      >
        <AmritaLogo size="sm" light={true} />
        <div className="w-px h-8 bg-white opacity-30" />
        <div>
          <p className="text-sm font-bold">RHISC Lab</p>
          <p className="text-xs opacity-70">Component Request Form</p>
        </div>
      </div>

      {/* Success Card */}
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md
                        w-full text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle
              size={56}
              className="text-green-500"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Request Submitted!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Your request has been sent to the lab assistant
            for review. Please keep your reference ID safe.
          </p>

          {/* Ref ID */}
          <div
            className="rounded-xl px-6 py-4 mb-6"
            style={{ backgroundColor: '#fdf2f5' }}
          >
            <p className="text-xs text-gray-500 mb-1">
              Your Reference ID
            </p>
            <p
              className="text-2xl font-bold tracking-wider"
              style={{ color: '#9B1B4B' }}
            >
              {ref_id}
            </p>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Show this ID to the lab assistant when collecting
            your components.
          </p>

          <button
            onClick={() => navigate('/')}
            className="text-white font-semibold px-8 py-2.5
                       rounded-xl text-sm hover:opacity-90
                       transition-all"
            style={{ backgroundColor: '#9B1B4B' }}
          >
            Submit Another Request
          </button>
        </div>
      </div>

    </div>
  );
};

export default SubmitSuccess;


